import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import Contact from "./Contact";
import PageModal from "./PageModal";
import ASCIIPortal from "./ASCIIPortal";
import Welcome from "./Welcome";
import DotGrid from "./DotGrid";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

function App() {
  const [cvText, setCvText] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [extractedCount, setExtractedCount] = useState(0);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [alreadyExtracted, setAlreadyExtracted] = useState(false);
  const [isVolunteerMode, setIsVolunteerMode] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in volunteer mode by checking if this was navigated from volunteer mission
    const volunteerMode = sessionStorage.getItem("volunteerMode");
    if (volunteerMode === "true") {
      setIsVolunteerMode(true);
      // Clear the flag after setting it
      sessionStorage.removeItem("volunteerMode");
    }
  }, []);

  useEffect(() => {
    // Load previously extracted user info from localStorage
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        setData(userInfo);
        setAlreadyExtracted(true);
        
        // Parse skills
        const skillsArray = userInfo.skills && Array.isArray(userInfo.skills) 
          ? userInfo.skills 
          : (userInfo.skills ? userInfo.skills.split(",").map(s => s.trim()).filter(s => s) : []);
        setSkills(skillsArray);
        
        // Parse education
        let educationArray = [];
        if (userInfo.education) {
          if (Array.isArray(userInfo.education)) {
            educationArray = userInfo.education.map(edu => ({
              school: edu.school || "",
              fieldOfStudy: edu.degree || "",
              from: edu.from || "",
              to: edu.to || "",
              location: edu.location || ""
            }));
          }
        }
        setEducation(educationArray);
        
        // Parse experience
        let experienceArray = [];
        if (userInfo.experience) {
          if (Array.isArray(userInfo.experience)) {
            experienceArray = userInfo.experience.map(exp => ({
              company: exp.company || "",
              position: exp.position || "",
              from: exp.from || "",
              to: exp.to || "",
              description: exp.description || ""
            }));
          }
        }
        setExperience(experienceArray);
        
        // Count extracted fields
        let count = 0;
        if (userInfo.name) count++;
        if (userInfo.email) count++;
        if (userInfo.phone) count++;
        if (userInfo.skills && userInfo.skills.length > 0) count++;
        if (userInfo.education) count++;
        if (userInfo.experience) count++;
        setExtractedCount(count);
        
        console.log("✅ Loaded user info from localStorage:", userInfo);
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    }
  }, []);

  // 1. READ FILE - Extract text and send to Groq
  const handleFile = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    setDragActive(false);

    setFileName(file.name);

    // ----- PDF -----
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let text = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(" ");
          }

          setCvText(text);
          console.log("✅ PDF text extracted, ready for Groq");
        } catch (error) {
          console.error("PDF extraction error:", error);
          alert("Error reading PDF: " + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // ----- DOCX -----
    else if (file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const { value } = await mammoth.extractRawText({
          arrayBuffer: reader.result
        });
        setCvText(value);
        console.log("✅ DOCX text extracted");
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // 2. SEND TO GROQ AI
  const extractInfo = async () => {
    if (!cvText) {
      alert("Upload a CV first!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/extract-cv",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }

      const result = await response.json();
      console.log("✅ Extracted CV data from Groq:", result);
      
      // Save to localStorage so it persists
      localStorage.setItem("userInfo", JSON.stringify(result));
      localStorage.setItem("cvUploaded", "true");
      
      setData(result);
      setAlreadyExtracted(true);
      
      // Parse skills into array
      const skillsArray = result.skills && Array.isArray(result.skills) 
        ? result.skills 
        : (result.skills ? result.skills.split(",").map(s => s.trim()).filter(s => s) : []);
      setSkills(skillsArray);
      
      // Parse education - Groq now returns structured array
      let educationArray = [];
      if (result.education) {
        if (Array.isArray(result.education)) {
          // Education is already an array from Groq
          educationArray = result.education.map(edu => ({
            school: edu.school || "",
            fieldOfStudy: edu.degree || "",
            from: edu.from || "",
            to: edu.to || "",
            location: edu.location || ""
          }));
        } else if (typeof result.education === 'string') {
          // Fallback for string format (legacy)
          const eduText = result.education;
          const entries = eduText.split(/[\n•-]/).filter(e => e.trim());
          
          if (entries.length > 0) {
            educationArray = entries.map(entry => {
              const dateMatch = entry.match(/(\d{4})\s*-\s*(\d{4})/);
              const from = dateMatch ? dateMatch[1] : "";
              const to = dateMatch ? dateMatch[2] : "";
              let cleanEntry = entry.replace(/\d{4}\s*-\s*\d{4}/g, "").trim();
              
              let school = "";
              let fieldOfStudy = "";
              const degreePattern = /\b(bachelor|master|phd|associate|diploma|certificate|in\s+|degree\s+(?:in|of)|major\s+(?:in)?|specialization|program|course|study|discipline)\b/i;
              const degreeMatch = cleanEntry.match(degreePattern);
              
              if (degreeMatch) {
                const matchIndex = cleanEntry.toLowerCase().indexOf(degreeMatch[0].toLowerCase());
                school = cleanEntry.substring(0, matchIndex).replace(/[,|]/g, "").trim();
                fieldOfStudy = cleanEntry.substring(matchIndex).replace(/[,|]/g, "").trim();
              } else {
                school = cleanEntry.replace(/[,|]/g, "").trim();
              }
              
              return { school, fieldOfStudy, from, to, location: "" };
            });
          }
        }
      }
      setEducation(educationArray);
      
      // Parse experience - Groq now returns structured array
      let experienceArray = [];
      if (result.experience) {
        if (Array.isArray(result.experience)) {
          // Experience is already an array from Groq
          experienceArray = result.experience.map(exp => ({
            company: exp.company || "",
            position: exp.position || "",
            from: exp.from || "",
            to: exp.to || "",
            description: exp.description || ""
          }));
        } else if (typeof result.experience === 'string') {
          // Fallback for string format (legacy) - just store as single description
          experienceArray = [{ company: "", position: "", from: "", to: "", description: result.experience }];
        }
      }
      setExperience(experienceArray);
      
      // Count extracted fields
      let count = 0;
      if (result.name) count++;
      if (result.email) count++;
      if (result.phone) count++;
      if (result.skills && result.skills.length > 0) count++;
      if (result.education) count++;
      if (result.experience) count++;
      setExtractedCount(count);
    } catch (e) {
      console.error("Full error:", e);
      alert(`❌ Error: ${e.message}\n\nMake sure the backend server is running:\nnpm run dev:groq`);
    }

    setLoading(false);
  };

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      const fakeEvent = { target: { files: [file], dataTransfer: { files: [file] } } };
      handleFile(fakeEvent);
    } else {
      alert("Please drop a PDF or DOCX file");
    }
  };

  // Submit volunteer application
  const handleVolunteerSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/volunteer-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          skills: skills,
          education: education,
          experience: experience,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setApplicationSubmitted(true);
      } else {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur réseau. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Show confirmation page if application was submitted
    applicationSubmitted ? (
      <div style={styles.container}>
        {/* DotGrid Background */}
        <div style={{...styles.dotGridWrapper, backgroundColor: "#0a0e27"}}>
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor="#4a5ab5"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        {/* Confirmation Page Content */}
        <div style={styles.contentWrapper}>
          <div style={styles.confirmationContainer}>
            <div style={styles.confirmationEmoji}>🎉</div>
            <h1 style={styles.confirmationTitle}>Application Submitted!</h1>
            <p style={styles.confirmationSubtitle}>Thank you for your interest in joining our guild!</p>
            
            <div style={styles.confirmationMessage}>
              <p style={styles.confirmationText}>
                Your volunteer application has been received successfully. Our team will review your profile and contact you soon at <strong>{data.email}</strong>.
              </p>
              <p style={styles.confirmationText}>
                We're excited to have you join our community! 🚀
              </p>
            </div>

            <button
              onClick={() => navigate('/navigate')}
              style={styles.confirmationButton}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    ) : (
      // Show form if not submitted
      <div style={styles.container}>
      {/* DotGrid Background */}
      <div style={{...styles.dotGridWrapper, backgroundColor: "#0a0e27"}}>
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#4a5ab5"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Content Container */}
      <div style={styles.contentWrapper}>
        {/* HOME BUTTON */}
        <button 
          onClick={() => navigate('/navigate')}
          style={styles.homeBtn}
        >
          🏠 Home
        </button>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>✨ AI CV Auto Fill</h1>
            <p style={styles.subtitle}>Extract and populate your resume data instantly with AI</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.mainContent}>
        {/* LEFT COLUMN - UPLOAD & EXTRACT */}
        <div style={styles.uploadSection}>
          {alreadyExtracted ? (
            // Show success message if already extracted
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.stepNumber}>✅</span>
                <h2 style={styles.cardTitle}>CV Already Loaded</h2>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'linear-gradient(135deg, rgba(82, 200, 130, 0.1) 0%, rgba(82, 150, 200, 0.1) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(82, 200, 130, 0.3)'
              }}>
                <p style={{ fontSize: '48px', margin: '0 0 15px 0' }}>✅</p>
                <p style={{ color: '#82d882', fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>Your CV has been extracted!</p>
                <p style={{ color: '#a0aeff', fontSize: '14px', margin: 0 }}>All your information is pre-filled below. You won't need to upload again.</p>
              </div>
            </div>
          ) : (
            // Show upload section if not yet extracted
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.stepNumber}>1</span>
                <h2 style={styles.cardTitle}>Upload Your CV</h2>
              </div>
              
              <div style={styles.uploadBox}>
                <input
                  type="file"
                  onChange={handleFile}
                  accept=".pdf,.docx"
                  style={styles.fileInput}
                  id="fileInput"
                />
                <label 
                  htmlFor="fileInput" 
                  style={{
                    ...styles.uploadLabel,
                    ...(dragActive && styles.uploadLabelDragActive)
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div style={styles.uploadIcon}>{dragActive ? "📥" : "📄"}</div>
                  <p style={styles.uploadText}>
                    {fileName ? `✅ ${fileName}` : (dragActive ? "Drop your file here" : "Click to upload PDF or DOCX")}
                  </p>
                  <p style={styles.uploadHint}>{dragActive ? "Release to upload" : "Drag and drop or click to select"}</p>
                </label>
              </div>

              <div style={styles.fileInfo}>
                {cvText && (
                  <div style={styles.infoCard}>
                    <span style={styles.infoBadge}>✓</span>
                    <div>
                      <p style={styles.infoLabel}>File Status</p>
                      <p style={styles.infoValue}>{cvText.length} characters loaded</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={extractInfo}
                disabled={!cvText || loading}
                style={{
                  ...styles.extractButton,
                  ...(loading ? styles.extractButtonLoading : {}),
                  ...(!cvText ? styles.extractButtonDisabled : {})
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}>⚙️</span> Extracting...
                  </>
                ) : (
                  <>
                    <span>🤖</span> Auto Fill CV
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - RESULTS */}
        <div style={styles.resultsSection}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.stepNumber}>2</span>
              <h2 style={styles.cardTitle}>Extracted Information</h2>
              {extractedCount > 0 && (
                <span style={styles.progressBadge}>{extractedCount}/6 fields</span>
              )}
            </div>

            {/* NAME */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>👤</span> Full Name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                style={styles.input}
              />
              {data.name && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* EMAIL */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📧</span> Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                style={styles.input}
              />
              {data.email && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* PHONE */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📱</span> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                style={styles.input}
              />
              {data.phone && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* SKILLS */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>⚡</span> Skills
              </label>
              <div style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <div key={index} style={styles.skillBadge}>
                    <span style={styles.skillText}>{skill}</span>
                    <button
                      onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      style={styles.skillDeleteBtn}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div style={styles.addSkillRow}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  placeholder="Add new skill and press Enter..."
                  style={styles.skillInput}
                />
                <button
                  onClick={() => {
                    if (newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                  style={styles.addButton}
                >
                  +
                </button>
              </div>
              {skills.length > 0 && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* EDUCATION */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>🎓</span> Education
              </label>
              <div style={styles.listContainer}>
                {education.map((edu, index) => (
                  <div key={index} style={styles.educationCard}>
                    <div style={styles.educationHeader}>
                      <h4 style={styles.educationTitle}>Education #{index + 1}</h4>
                      <button
                        onClick={() => setEducation(education.filter((_, i) => i !== index))}
                        style={styles.deleteButton}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div style={styles.educationGrid}>
                      <input
                        type="text"
                        placeholder="School/University Name"
                        value={edu.school || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[index].school = e.target.value;
                          setEducation(updated);
                        }}
                        style={styles.educationInput}
                      />
                      <input
                        type="text"
                        placeholder="Field of Study (e.g., Computer Science)"
                        value={edu.fieldOfStudy || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[index].fieldOfStudy = e.target.value;
                          setEducation(updated);
                        }}
                        style={styles.educationInput}
                      />
                      <input
                        type="text"
                        placeholder="From (e.g., 2015)"
                        value={edu.from || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[index].from = e.target.value;
                          setEducation(updated);
                        }}
                        style={styles.educationInput}
                      />
                      <input
                        type="text"
                        placeholder="To (e.g., 2019)"
                        value={edu.to || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[index].to = e.target.value;
                          setEducation(updated);
                        }}
                        style={styles.educationInput}
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={edu.location || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[index].location = e.target.value;
                          setEducation(updated);
                        }}
                        style={styles.educationInput}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    setEducation([...education, { school: "", fieldOfStudy: "", from: "", to: "", location: "" }]);
                  }}
                  style={styles.addEducationButton}
                >
                  + Add Education Entry
                </button>
              </div>
              {education.length > 0 && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* EXPERIENCE */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>💼</span> Work Experience
              </label>
              <div style={styles.listContainer}>
                {experience.map((exp, index) => (
                  <div key={index} style={styles.experienceCard}>
                    <div style={styles.experienceHeader}>
                      <h4 style={styles.experienceTitle}>Experience #{index + 1}</h4>
                      <button
                        onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                        style={styles.deleteButton}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div style={styles.experienceGrid}>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company || ""}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[index].company = e.target.value;
                          setExperience(updated);
                        }}
                        style={styles.experienceInput}
                      />
                      <input
                        type="text"
                        placeholder="Job Title/Position"
                        value={exp.position || ""}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[index].position = e.target.value;
                          setExperience(updated);
                        }}
                        style={styles.experienceInput}
                      />
                      <input
                        type="text"
                        placeholder="From (e.g., 2020)"
                        value={exp.from || ""}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[index].from = e.target.value;
                          setExperience(updated);
                        }}
                        style={styles.experienceInput}
                      />
                      <input
                        type="text"
                        placeholder="To (e.g., 2023) or Present"
                        value={exp.to || ""}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[index].to = e.target.value;
                          setExperience(updated);
                        }}
                        style={styles.experienceInput}
                      />
                      <textarea
                        placeholder="Job description and responsibilities"
                        value={exp.description || ""}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[index].description = e.target.value;
                          setExperience(updated);
                        }}
                        rows="3"
                        style={{...styles.experienceInput, gridColumn: "1 / -1"}}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    setExperience([...experience, { company: "", position: "", from: "", to: "", description: "" }]);
                  }}
                  style={styles.addEducationButton}
                >
                  + Add Experience Entry
                </button>
              </div>
              {experience.length > 0 && <span style={styles.checkmark}>✓</span>}
            </div>

            {/* ACTION BUTTONS */}
            <div style={styles.buttonGroup}>
              <button
                onClick={() => {
                  setData({});
                  setCvText("");
                  setFileName("");
                  setExtractedCount(0);
                  setSkills([]);
                  setEducation([]);
                  setExperience([]);
                  setNewSkill("");
                }}
                style={styles.resetButton}
              >
                🔄 Clear All
              </button>
              <button
                onClick={() => {
                  const skillsText = skills.join(", ");
                  const educationText = education.map(e => 
                    `${e.school}${e.fieldOfStudy ? " - " + e.fieldOfStudy : ""} (${e.from} - ${e.to || "Present"})${e.location ? " - " + e.location : ""}`
                  ).join("\n");
                  const experienceText = experience.map(e =>
                    `${e.position}${e.company ? " at " + e.company : ""} (${e.from} - ${e.to || "Present"})${e.description ? "\n  " + e.description : ""}`
                  ).join("\n");
                  const text = `${data.name || "N/A"}\n${data.email || "N/A"}\n${data.phone || "N/A"}\n\nSkills:\n${skillsText || "N/A"}\n\nEducation:\n${educationText || "N/A"}\n\nExperience:\n${experienceText || "N/A"}`;
                  navigator.clipboard.writeText(text);
                  alert("Copied to clipboard!");
                }}
                style={styles.copyButton}
              >
                📋 Copy All
              </button>

              {/* Volunteer Submit Button - Only show if in volunteer mode */}
              {isVolunteerMode && (
                <button
                  onClick={handleVolunteerSubmit}
                  disabled={loading}
                  style={{
                    ...styles.volunteerSubmitButton,
                    ...(loading ? styles.volunteerSubmitButtonLoading : {})
                  }}
                >
                  {loading ? "⚙️ Submitting Application..." : "🚀 Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Powered by <strong>Groq AI</strong> | Fast • Accurate • Free
        </p>
        <button
          onClick={() => navigate("/navigate")}
          style={styles.contactButton}
        >
          🌐 Accéder au Nexus Connecté
        </button>
      </div>
      </div>
    </div>
      ) // Close ternary - end of regular form
    );
  }

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flex: 1,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  dotGridWrapper: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  contentWrapper: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
  },
  homeBtn: {
    position: "fixed",
    top: "20px",
    left: "20px",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    zIndex: 10,
  },
  header: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "40px 20px",
    textAlign: "center",
    color: "white",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 10px 0",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.95,
    margin: 0,
    fontWeight: "300",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "30px",
  },
  uploadSection: {},
  resultsSection: {},
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },
  stepNumber: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
    flex: 1,
  },
  progressBadge: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  uploadBox: {
    position: "relative",
    marginBottom: "20px",
  },
  fileInput: {
    display: "none",
  },
  uploadLabel: {
    display: "block",
    border: "2px dashed #667eea",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "#f8f9ff",
    ":hover": {
      borderColor: "#764ba2",
      background: "#f0f1ff",
    },
  },
  uploadLabelDragActive: {
    borderColor: "#764ba2",
    background: "#f0f1ff",
    borderWidth: "3px",
    boxShadow: "0 0 20px rgba(102, 126, 234, 0.3)",
    transform: "scale(1.02)",
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "10px",
  },
  uploadText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "10px 0 5px 0",
  },
  uploadHint: {
    fontSize: "13px",
    color: "#999",
    margin: 0,
  },
  fileInfo: {
    marginBottom: "20px",
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f0f8f0",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d0e8d0",
  },
  infoBadge: {
    background: "#4caf50",
    color: "white",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#666",
    margin: 0,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "14px",
    color: "#1a1a1a",
    margin: 0,
    fontWeight: "600",
  },
  extractButton: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
  },
  extractButtonLoading: {
    opacity: 0.8,
  },
  extractButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  fieldGroup: {
    marginBottom: "20px",
    position: "relative",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  labelIcon: {
    fontSize: "18px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    resize: "vertical",
  },
  checkmark: {
    position: "absolute",
    right: "12px",
    top: "38px",
    color: "#4caf50",
    fontSize: "20px",
    fontWeight: "700",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e0e0e0",
  },
  resetButton: {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    background: "#f5f5f5",
    color: "#1a1a1a",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  copyButton: {
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  footer: {
    textAlign: "center",
    padding: "30px 20px",
    color: "white",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "40px",
  },
  footerText: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  contactButton: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "8px",
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
  // Skills and Education List Styles
  listContainer: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #e0e0e0",
  },
  listItem: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
    alignItems: "center",
  },
  listInput: {
    flex: 1,
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  addItemRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  deleteButton: {
    padding: "8px 12px",
    fontSize: "16px",
    background: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    minWidth: "40px",
  },
  addButton: {
    padding: "10px 16px",
    fontSize: "18px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    minWidth: "45px",
  },
  addEducationButton: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    background: "#e8eaff",
    color: "#667eea",
    border: "2px dashed #667eea",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    marginTop: "10px",
  },
  educationCard: {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  educationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  educationTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  educationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  educationInput: {
    padding: "10px 12px",
    fontSize: "13px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  // Experience Card Styles
  experienceCard: {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  experienceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  experienceTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  experienceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  experienceInput: {
    padding: "10px 12px",
    fontSize: "13px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  // Skill Badges Styles
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px",
    background: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    minHeight: "44px",
    alignContent: "flex-start",
  },
  skillBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    borderRadius: "20px",
    fontWeight: "500",
    fontSize: "13px",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
    animation: "slideIn 0.3s ease",
  },
  skillText: {
    userSelect: "none",
  },
  skillDeleteBtn: {
    background: "rgba(255, 255, 255, 0.3)",
    border: "none",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    padding: 0,
    marginLeft: "4px",
  },
  addSkillRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  skillInput: {
    flex: 1,
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
};

// Volunteer Submit Button Styles
const volunteerSubmitButtonStyle = {
  marginTop: "20px",
  padding: "14px 28px",
  fontSize: "16px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #52c282 0%, #2f8a54 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 20px rgba(82, 194, 130, 0.3)",
  width: "100%",
};

// Add styles to the styles object
styles.volunteerSubmitButton = volunteerSubmitButtonStyle;
styles.volunteerSubmitButtonLoading = {
  ...volunteerSubmitButtonStyle,
  opacity: 0.6,
  cursor: "not-allowed",
};

styles.confirmationContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  textAlign: "center",
  padding: "40px 20px",
  maxWidth: "600px",
  margin: "0 auto",
};

styles.confirmationEmoji = {
  fontSize: "120px",
  marginBottom: "30px",
  animation: "bounce 0.6s ease",
};

styles.confirmationTitle = {
  fontSize: "52px",
  fontWeight: "800",
  margin: "0 0 15px 0",
  color: "#82d882",
  textShadow: "0 2px 10px rgba(130, 216, 130, 0.3)",
};

styles.confirmationSubtitle = {
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 30px 0",
  color: "#b0c4ff",
};

styles.confirmationMessage = {
  background: "linear-gradient(135deg, rgba(82, 200, 130, 0.1) 0%, rgba(82, 150, 200, 0.1) 100%)",
  border: "1px solid rgba(82, 200, 130, 0.3)",
  borderRadius: "15px",
  padding: "30px",
  margin: "30px 0",
};

styles.confirmationText = {
  fontSize: "16px",
  color: "#c9d6ff",
  lineHeight: "1.6",
  margin: "15px 0",
};

styles.confirmationButton = {
  marginTop: "30px",
  padding: "16px 40px",
  fontSize: "16px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #5227FF 0%, #7c3aed 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 20px rgba(82, 39, 255, 0.3)",
};

// Component to redirect to /portal on every page load/restart
function RootRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Always navigate to portal when root is accessed
    navigate("/portal", { replace: true });
  }, [navigate]);
  
  return null;
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/portal" element={<ASCIIPortal />} />
        <Route path="/navigate" element={<PageModal />} />
        <Route path="/nexus" element={<Contact />} />
        <Route path="/extract" element={<App />} />
      </Routes>
    </Router>
  );
}
