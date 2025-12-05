import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import DotGrid from "./DotGrid";

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnMission = location.state?.returnMission;
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

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

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

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
            setTimeout(() => {
              if (returnMission === "volunteer") {
                navigate("/nexus", { state: { userInfo: extractedData, selectMission: "volunteer" } });
              } else {
                navigate("/nexus", { state: { userInfo: extractedData } });
              }
            }, 1000);
          }
          setLoading(false);
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
            setTimeout(() => {
              if (returnMission === "volunteer") {
                navigate("/nexus", { state: { userInfo: extractedData, selectMission: "volunteer" } });
              } else {
                navigate("/nexus", { state: { userInfo: extractedData } });
              }
            }, 1000);
          }
          setLoading(false);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur lors de la lecture du fichier");
      setLoading(false);
    }
  };

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
      handleFile(file);
    } else {
      alert("Veuillez déposer un fichier PDF ou DOCX");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

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
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>🚀 Bienvenue à NUIT D'INFO</h1>
            <p style={styles.subtitle}>Commencez votre aventure avec nous</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.mainContent}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}>
              <span style={styles.welcomeIcon}>📄</span>
            </div>

            <h2 style={styles.cardTitle}>Téléchargez votre CV</h2>
            <p style={styles.description}>
              Importez votre CV (PDF ou DOCX) pour que nous puissions pré-remplir vos informations
            </p>

            <div
              style={{
                ...styles.uploadBox,
                ...(dragActive && styles.uploadBoxActive)
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileInput}
                accept=".pdf,.docx"
                style={styles.fileInput}
                id="cvFileInput"
                disabled={loading}
              />
              <label htmlFor="cvFileInput" style={styles.uploadLabel}>
                <div style={styles.uploadIconLarge}>
                  {dragActive ? "📥" : "📤"}
                </div>
                <p style={styles.uploadText}>
                  {fileName ? `✅ ${fileName}` : (dragActive ? "Déposez votre fichier ici" : "Cliquez ou déposez votre CV")}
                </p>
                <p style={styles.uploadHint}>PDF ou DOCX • Max 50MB</p>
              </label>
            </div>

            {loading && (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}>⚙️</div>
                <p style={styles.loadingText}>Extraction de vos données...</p>
              </div>
            )}

            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>ℹ️ Informations utilisées</p>
              <ul style={styles.infoList}>
                <li>Nom complet</li>
                <li>Email</li>
                <li>Numéro de téléphone</li>
                <li>Compétences (optionnel)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Vos données sont traitées de manière sécurisée et ne seront jamais partagées
          </p>
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
  header: {
    background: "linear-gradient(135deg, rgba(82, 39, 255, 0.1) 0%, rgba(74, 90, 181, 0.1) 100%)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(82, 39, 255, 0.2)",
    padding: "60px 20px",
    textAlign: "center",
    color: "white",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "56px",
    fontWeight: "800",
    margin: "0 0 12px 0",
    background: "linear-gradient(135deg, #82b1ff 0%, #9575ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.85,
    margin: 0,
    fontWeight: "300",
    color: "#b0c4ff",
    letterSpacing: "0.5px",
  },
  mainContent: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "0 20px",
    width: "100%",
    flex: 1,
  },
  card: {
    background: "linear-gradient(135deg, rgba(20, 10, 40, 0.6) 0%, rgba(25, 15, 50, 0.6) 100%)",
    borderRadius: "20px",
    padding: "50px 40px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(82, 39, 255, 0.15)",
    backdropFilter: "blur(10px)",
  },
  iconWrapper: {
    textAlign: "center",
    marginBottom: "25px",
  },
  welcomeIcon: {
    fontSize: "64px",
    display: "inline-block",
  },
  cardTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#e8ecff",
    margin: "0 0 12px 0",
    textAlign: "center",
    background: "linear-gradient(135deg, #82b1ff 0%, #c9a8ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  description: {
    fontSize: "15px",
    color: "#a0aeff",
    textAlign: "center",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  uploadBox: {
    border: "2px dashed rgba(82, 39, 255, 0.4)",
    borderRadius: "15px",
    padding: "40px 20px",
    textAlign: "center",
    transition: "all 0.3s ease",
    background: "rgba(82, 39, 255, 0.05)",
    cursor: "pointer",
    marginBottom: "30px",
  },
  uploadBoxActive: {
    borderColor: "rgba(82, 39, 255, 0.8)",
    background: "rgba(82, 39, 255, 0.15)",
    transform: "scale(1.02)",
    boxShadow: "0 0 20px rgba(82, 39, 255, 0.3)",
  },
  fileInput: {
    display: "none",
  },
  uploadLabel: {
    cursor: "pointer",
    display: "block",
  },
  uploadIconLarge: {
    fontSize: "56px",
    marginBottom: "15px",
  },
  uploadText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#e8ecff",
    margin: "10px 0 5px 0",
  },
  uploadHint: {
    fontSize: "13px",
    color: "#8090b0",
    margin: 0,
  },
  loadingContainer: {
    textAlign: "center",
    padding: "30px",
  },
  spinner: {
    fontSize: "48px",
    marginBottom: "15px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#a0aeff",
    fontSize: "15px",
    margin: 0,
  },
  infoBox: {
    background: "rgba(82, 39, 255, 0.1)",
    border: "1px solid rgba(82, 39, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "25px",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#c9d6ff",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  infoList: {
    fontSize: "13px",
    color: "#a0aeff",
    margin: 0,
    paddingLeft: "20px",
  },
  footer: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#a0aeff",
    borderTop: "1px solid rgba(82, 39, 255, 0.15)",
    background: "rgba(20, 10, 40, 0.3)",
  },
  footerText: {
    fontSize: "13px",
    opacity: 0.75,
    margin: 0,
    letterSpacing: "0.3px",
  },
};

export default Welcome;
