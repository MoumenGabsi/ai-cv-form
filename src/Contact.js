import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import DotGrid from "./DotGrid";
import Carousel from "./Carousel";
import "./Contact.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

// Custom carousel wrapper for missions
function CarouselMissions({ items, onSelect }) {
  const handleItemSelect = (itemId) => {
    onSelect(itemId);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ height: '300px', position: 'relative' }}>
        <Carousel
          items={items.map(item => ({
            ...item,
            icon: <span style={{ fontSize: '48px' }}>{item.icon}</span>,
            path: item.id
          }))}
          baseWidth={350}
          autoplay={false}
          pauseOnHover={true}
          loop={true}
          round={false}
          onSelectItem={handleItemSelect}
        />
      </div>
    </div>
  );
}

function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const [missionType, setMissionType] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    amount: "",
    recurrence: "one-time",
    skills: "",
    availability: "",
    subject: "",
    question: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  // Load user info from localStorage on mount
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded) {
      const savedInfo = localStorage.getItem("userInfo");
      const cvAlreadyUploaded = localStorage.getItem("cvUploaded");
      
      if (savedInfo) {
        const info = JSON.parse(savedInfo);
        setUserInfo(info);
        setFormData(prev => ({
          ...prev,
          name: info.name || "",
          email: info.email || "",
          phone: info.phone || "",
        }));
      }
      
      if (cvAlreadyUploaded) {
        setCvUploaded(true);
      }
      
      setLoaded(true);
    }
  }, [loaded]);

  const currentYear = new Date().getFullYear();

  const extractUserInfo = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/api/extract-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text })
      });

      if (!response.ok) throw new Error("Extraction failed");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de l'extraction. Veuillez réessayer.");
      return null;
    }
  };

  const handleCVFile = async (file) => {
    if (!file) return;

    setUploadingCV(true);

    try {
      let text = "";

      // ----- PDF -----
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            text += strings.join(" ");
          }

          const extractedData = await extractUserInfo(text);
          if (extractedData) {
            localStorage.setItem("userInfo", JSON.stringify(extractedData));
            localStorage.setItem("cvUploaded", "true");
            setUserInfo(extractedData);
            setFormData(prev => ({
              ...prev,
              name: extractedData.name || "",
              email: extractedData.email || "",
              phone: extractedData.phone || "",
            }));
            setCvUploaded(true);
          }
          setUploadingCV(false);
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
          const extractedData = await extractUserInfo(value);
          if (extractedData) {
            localStorage.setItem("userInfo", JSON.stringify(extractedData));
            localStorage.setItem("cvUploaded", "true");
            setUserInfo(extractedData);
            setFormData(prev => ({
              ...prev,
              name: extractedData.name || "",
              email: extractedData.email || "",
              phone: extractedData.phone || "",
            }));
            setCvUploaded(true);
          }
          setUploadingCV(false);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de la lecture du fichier");
      setUploadingCV(false);
    }
  };

  const handleCVInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
        handleCVFile(file);
      } else {
        alert("Veuillez sélectionner un fichier PDF ou DOCX");
      }
    }
  };

  const handleCVDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      handleCVFile(file);
    } else {
      alert("Veuillez déposer un fichier PDF ou DOCX");
    }
  };

  const handleMissionSelect = (type) => {
    // If volunteer is selected, navigate to /extract page with volunteer mode flag
    if (type === "volunteer") {
      sessionStorage.setItem("volunteerMode", "true");
      navigate("/extract");
      return;
    }
    
    setMissionType(type);
    // Keep the pre-filled user info (name, email, phone) but reset mission-specific fields
    setFormData(prev => ({
      ...prev,
      message: "",
      amount: "",
      recurrence: "one-time",
      skills: "",
      availability: "",
      subject: "",
      question: ""
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Nom et Email sont obligatoires!");
      return false;
    }
    
    if (missionType === "donation" && (!formData.amount || parseFloat(formData.amount) <= 0)) {
      alert("Montant de don valide requis!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email invalide!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionType,
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          // Reset form and go back to mission selection
          setMissionType("");
          setSubmitted(false);
        }, 2000);
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

  const renderForm = () => {
    const commonFields = (
      <>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nom Complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Votre nom"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="votre.email@example.com"
            style={styles.input}
            required
          />
        </div>
      </>
    );

    switch (missionType) {
      case "contact":
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 6 XX XX XX XX"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Votre message..."
                rows="5"
                style={styles.textarea}
                required
              />
            </div>
          </>
        );

      case "donation":
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Montant du Don (€)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Ex: 50"
                min="1"
                step="0.01"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Récurrence</label>
              <select
                name="recurrence"
                value={formData.recurrence}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="one-time">Don unique</option>
                <option value="monthly">Don mensuel</option>
                <option value="yearly">Don annuel</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message (optionnel)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Dites-nous pourquoi vous nous soutenez..."
                rows="3"
                style={styles.textarea}
              />
            </div>
          </>
        );

      case "volunteer":
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 6 XX XX XX XX"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Compétences</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Ex: Développement web, Design, Marketing..."
                rows="3"
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Disponibilité</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="">Sélectionner</option>
                <option value="flexible">Flexible</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Soirées</option>
                <option value="fulltime">Temps plein</option>
              </select>
            </div>
          </>
        );

      case "info":
        return (
          <>
            {commonFields}
            <div style={styles.formGroup}>
              <label style={styles.label}>Sujet</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Ex: Partenariat, Questions techniques..."
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Question/Demande</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Décrivez votre demande..."
                rows="5"
                style={styles.textarea}
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getMissionTitle = () => {
    const titles = {
      contact: "📞 Établir le Contact",
      donation: "💰 Offrir un Don",
      volunteer: "🛡️ Rejoindre la Guilde",
      info: "❓ Demander des Informations"
    };
    return titles[missionType] || "";
  };

  const missionCarouselItems = [
    {
      title: 'Établir le Contact',
      description: 'Nous parler directement',
      id: 'contact',
      icon: '📞'
    },
    {
      title: 'Offrir un Don',
      description: 'Soutenir notre cause',
      id: 'donation',
      icon: '💰'
    },
    {
      title: 'Rejoindre la Guilde',
      description: 'Devenir bénévole',
      id: 'volunteer',
      icon: '🛡️'
    },
    {
      title: 'Demander des Informations',
      description: 'Poser une question',
      id: 'info',
      icon: '❓'
    }
  ];

  return (
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

      {/* Content Wrapper */}
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
            <h1 style={styles.title}>🌐 Nexus Connecté</h1>
            {userInfo.name && (
              <h2 style={styles.greeting}>Bienvenue, {userInfo.name}! 👋</h2>
            )}
            <p style={styles.subtitle}>L'Écho Personnalisé de Notre Communauté</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.mainContent}>
        {/* CV UPLOAD OVERLAY - Show only if not uploaded yet */}
        {!cvUploaded && (
          <div 
            style={styles.cvOverlay}
            onDragEnter={(e) => { e.preventDefault(); }}
            onDragOver={(e) => { e.preventDefault(); }}
            onDragLeave={(e) => { e.preventDefault(); }}
            onDrop={handleCVDrop}
            onClick={() => document.getElementById('cv-file-input')?.click()}
          >
            <div style={styles.cvModal}>
              <div style={styles.cvIcon}>📄</div>
              <h2 style={styles.cvTitle}>Téléchargez votre CV</h2>
              <p style={styles.cvSubtitle}>Importez votre CV (PDF ou DOCX) pour que nous puissions pré-remplir vos informations</p>
              
              <div style={styles.cvDropZone}>
                <div style={styles.cvDropIcon}>📥</div>
                <h3 style={styles.cvDropTitle}>Cliquez ou déposez votre CV</h3>
                <p style={styles.cvDropText}>PDF ou DOCX • Max 50MB</p>
              </div>

              <input 
                id="cv-file-input"
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleCVInputChange}
                style={{ display: 'none' }}
              />

              <div style={styles.cvInfo}>
                <p style={styles.cvInfoTitle}>📋 INFORMATIONS UTILISÉES</p>
                <ul style={styles.cvInfoList}>
                  <li>Nom complet</li>
                  <li>Email</li>
                  <li>Numéro de téléphone</li>
                  <li>Compétences (optionnel)</li>
                </ul>
              </div>

              {uploadingCV && (
                <div style={styles.uploadingSpinner}>
                  <div style={styles.spinner}></div>
                  <p>Extraction en cours...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MISSION SELECTION OR FORM */}
        <div style={styles.card}>
          {!missionType ? (
            <>
              <h2 style={styles.cardTitle}>🗣️ Choisissez Votre Mission ✨</h2>
              <p style={styles.subtitle2}>Sélectionnez comment vous souhaitez nous contacter</p>

              <div style={styles.carouselWrapper}>
                <CarouselMissions 
                  items={missionCarouselItems}
                  onSelect={handleMissionSelect}
                />
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleMissionSelect("")}
                style={styles.backButton}
              >
                ← Retour aux missions
              </button>

              <h2 style={styles.cardTitle}>{getMissionTitle()}</h2>

              <form onSubmit={handleSubmit} style={styles.form}>
                {renderForm()}

                <button
                  type="submit"
                  disabled={loading || submitted}
                  style={{
                    ...styles.submitButton,
                    ...(loading || submitted ? styles.submitButtonDisabled : {})
                  }}
                >
                  {loading ? "⚙️ Envoi en cours..." : submitted ? "✅ Envoyé!" : "🚀 Envoyer"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Année {currentYear} | Nexus Connecté © L'Association
          </p>
          <button
            onClick={() => navigate("/extract")}
            style={styles.navButton}
          >
            ← Retour au Formulaire CV
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
    position: "relative",
    display: "flex",
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
    overflow: "auto",
  },
  homeBtn: {
    position: "fixed",
    top: "20px",
    left: "20px",
    background: "rgba(82, 39, 255, 0.15)",
    color: "#82b1ff",
    border: "1.5px solid rgba(82, 39, 255, 0.4)",
    borderRadius: "10px",
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    zIndex: 10,
  },
  header: {
    background: "linear-gradient(135deg, rgba(82, 39, 255, 0.1) 0%, rgba(74, 90, 181, 0.1) 100%)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(82, 39, 255, 0.2)",
    padding: "50px 20px",
    textAlign: "center",
    color: "white",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "52px",
    fontWeight: "800",
    margin: "0 0 12px 0",
    background: "linear-gradient(135deg, #82b1ff 0%, #9575ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "none",
  },
  greeting: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "8px 0 0 0",
    color: "#c9a8ff",
    textShadow: "0 2px 10px rgba(201, 168, 255, 0.2)",
  },
  subtitle: {
    fontSize: "16px",
    opacity: 0.85,
    margin: 0,
    fontWeight: "300",
    color: "#b0c4ff",
    letterSpacing: "0.5px",
  },
  subtitle2: {
    fontSize: "16px",
    color: "#a0aeff",
    marginBottom: "30px",
    textAlign: "center",
    fontWeight: "300",
  },
  mainContent: {
    maxWidth: "950px",
    margin: "40px auto",
    padding: "0 20px",
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: "linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(25, 15, 50, 0.6) 100%)",
    borderRadius: "20px",
    padding: "45px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(82, 39, 255, 0.15)",
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#e8ecff",
    margin: "0 0 15px 0",
    textAlign: "center",
    background: "linear-gradient(135deg, #82b1ff 0%, #c9a8ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  carouselWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "30px",
    padding: "20px 0",
  },
  backButton: {
    background: "rgba(82, 39, 255, 0.1)",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    color: "#82b1ff",
    borderRadius: "10px",
    padding: "12px 24px",
    cursor: "pointer",
    marginBottom: "25px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    marginTop: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#c9d6ff",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  input: {
    padding: "14px 18px",
    fontSize: "14px",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    borderRadius: "10px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "rgba(30, 15, 60, 0.5)",
    color: "#e8ecff",
  },
  textarea: {
    padding: "14px 18px",
    fontSize: "14px",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    borderRadius: "10px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    resize: "vertical",
    background: "rgba(30, 15, 60, 0.5)",
    color: "#e8ecff",
  },
  submitButton: {
    padding: "16px 28px",
    fontSize: "16px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #5227FF 0%, #7c3aed 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "25px",
    boxShadow: "0 8px 20px rgba(82, 39, 255, 0.3)",
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  footer: {
    textAlign: "center",
    padding: "35px 20px",
    color: "white",
    borderTop: "1px solid rgba(82, 39, 255, 0.15)",
    background: "rgba(20, 10, 40, 0.3)",
  },
  footerText: {
    margin: "0 0 15px 0",
    fontSize: "13px",
    opacity: 0.75,
    color: "#a0aeff",
    letterSpacing: "0.3px",
  },
  navButton: {
    background: "linear-gradient(135deg, rgba(82, 39, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
    color: "#82b1ff",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    borderRadius: "10px",
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  cvOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    cursor: "pointer",
  },
  cvModal: {
    background: "linear-gradient(135deg, rgba(20, 10, 40, 0.9) 0%, rgba(25, 15, 50, 0.9) 100%)",
    borderRadius: "25px",
    padding: "50px",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    maxWidth: "600px",
    width: "90%",
    textAlign: "center",
    cursor: "default",
  },
  cvIcon: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  cvTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#82b1ff",
    margin: "0 0 10px 0",
  },
  cvSubtitle: {
    fontSize: "14px",
    color: "#a0aeff",
    margin: "0 0 30px 0",
    lineHeight: "1.5",
  },
  cvDropZone: {
    border: "2px dashed rgba(82, 39, 255, 0.4)",
    borderRadius: "15px",
    padding: "40px 20px",
    marginBottom: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  cvDropIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  cvDropTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e8ecff",
    margin: "0 0 8px 0",
  },
  cvDropText: {
    fontSize: "13px",
    color: "#b0c4ff",
    margin: 0,
  },
  cvInfo: {
    background: "rgba(82, 39, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(82, 39, 255, 0.2)",
    textAlign: "left",
  },
  cvInfoTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#82b1ff",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cvInfoList: {
    margin: 0,
    paddingLeft: "20px",
    listStyleType: "disc",
  },
  uploadingSpinner: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    color: "#82b1ff",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(82, 39, 255, 0.2)",
    borderTop: "3px solid #82b1ff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default Contact;
