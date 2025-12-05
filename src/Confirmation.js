import { useSearchParams, useNavigate } from "react-router-dom";
import DotGrid from "./DotGrid";

function Confirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const missionType = searchParams.get("type");
  const userName = decodeURIComponent(searchParams.get("name") || "Voyageur");
  const currentYear = new Date().getFullYear();

  // Extract form data from query params
  const formData = {
    email: decodeURIComponent(searchParams.get("email") || ""),
    phone: decodeURIComponent(searchParams.get("phone") || ""),
    message: decodeURIComponent(searchParams.get("message") || ""),
    amount: searchParams.get("amount") || "",
    recurrence: searchParams.get("recurrence") || "",
    skills: decodeURIComponent(searchParams.get("skills") || ""),
    availability: searchParams.get("availability") || "",
    subject: decodeURIComponent(searchParams.get("subject") || ""),
    question: decodeURIComponent(searchParams.get("question") || "")
  };

  const getConfirmationContent = () => {
    const baseContent = {
      contact: {
        emoji: "📞",
        title: "Merci pour votre Contact! 👋",
        message: `Salutations, ${userName}! 👋 Ton message a bien été acheminé vers nos serveurs centraux 📡. Nos "Agents de Support" 🕵️ te répondront sous peu.`,
        impact: `Ton engagement en ${currentYear} aide notre communauté à mieux communiquer avec ses supporters! 📈`,
        details: {
          label: "📧 Détails de votre Contact:",
          fields: [
            { icon: "👤", label: "Nom", value: userName },
            { icon: "✉️", label: "Email", value: formData.email },
            { icon: "📱", label: "Téléphone", value: formData.phone || "Non fourni" },
            { icon: "💬", label: "Message", value: formData.message }
          ]
        }
      },
      donation: {
        emoji: "💰",
        title: `Un immense GG, ${userName}! 🏆`,
        message: `Ton "Don de Ressources" 💎 est une bénédiction pour notre cause 🙏. Il permettra de financer nos projets essentiels et d'avancer dans notre mission.`,
        impact: `Grâce à toi, nous pouvons progresser sur nos objectifs ${currentYear}! 🚀`,
        details: {
          label: "💳 Résumé de votre Don:",
          fields: [
            { icon: "👤", label: "Nom", value: userName },
            { icon: "✉️", label: "Email", value: formData.email },
            { icon: "💵", label: "Montant", value: `${formData.amount}€` },
            { icon: "🔄", label: "Récurrence", value: formData.recurrence === "one-time" ? "Don unique" : formData.recurrence === "monthly" ? "Mensuel" : "Annuel" },
            { icon: "💭", label: "Message", value: formData.message || "Aucun message" }
          ]
        }
      },
      volunteer: {
        emoji: "🛡️",
        title: `Bienvenue à la Guilde, ${userName}! ⚔️`,
        message: `Ton intention de rejoindre notre communauté de bénévoles est fantastique! 🙌 Tes compétences seront précieuses pour notre cause.`,
        impact: `Avec des contributeurs comme toi en ${currentYear}, nous pouvons accomplir des merveilles! ✨`,
        details: {
          label: "🛡️ Votre Profil de Bénévole:",
          fields: [
            { icon: "👤", label: "Nom", value: userName },
            { icon: "✉️", label: "Email", value: formData.email },
            { icon: "📱", label: "Téléphone", value: formData.phone },
            { icon: "🎯", label: "Compétences", value: formData.skills },
            { icon: "⏰", label: "Disponibilité", value: formData.availability === "flexible" ? "Flexible" : formData.availability === "weekends" ? "Weekends" : formData.availability === "evenings" ? "Soirées" : "Temps plein" }
          ]
        }
      },
      info: {
        emoji: "❓",
        title: `Merci pour ta Question, ${userName}! 🧠`,
        message: `Nous avons bien reçu ta demande d'informations 📬. Notre équipe t'aidera à trouver les réponses que tu cherches.`,
        impact: `Chaque question nous aide à mieux servir notre communauté en ${currentYear}! 💡`,
        details: {
          label: "📋 Détails de votre Demande:",
          fields: [
            { icon: "👤", label: "Nom", value: userName },
            { icon: "✉️", label: "Email", value: formData.email },
            { icon: "📝", label: "Sujet", value: formData.subject },
            { icon: "❓", label: "Question", value: formData.question }
          ]
        }
      }
    };

    return baseContent[missionType] || baseContent.contact;
  };

  const content = getConfirmationContent();

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

        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>🌟 Zone de Confirmation Personnalisée</h1>
            <p style={styles.subtitle}>L'Écho de Gratitude</p>
          </div>
        </div>

        <div style={styles.mainContent}>
          <div style={styles.card}>
            <div style={styles.emoji}>{content.emoji}</div>
            
            <h1 style={styles.mainTitle}>
              {content.title}
            </h1>

            <p style={styles.message}>
              {content.message}
            </p>

            <div style={styles.impactBox}>
              <p style={styles.impactTitle}>💫 Impact de Ton Soutien:</p>
              <p style={styles.impactText}>
                {content.impact}
              </p>
            </div>

            {/* Display submitted form data */}
            {content.details && (
              <div style={styles.detailsBox}>
                <p style={styles.detailsTitle}>{content.details.label}</p>
                <div style={styles.detailsGrid}>
                  {content.details.fields.map((field, index) => (
                    <div key={index} style={styles.detailField}>
                      <span style={styles.detailIcon}>{field.icon}</span>
                      <div style={styles.detailContent}>
                        <p style={styles.detailLabel}>{field.label}</p>
                        <p style={styles.detailValue}>{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.yearSection}>
              <h3 style={styles.yearTitle}>🗓️ Année {currentYear}</h3>
              <ul style={styles.yearList}>
                <li>🎯 Nos objectifs annuels avancent grâce à toi!</li>
                <li>📈 Chaque contribution compte pour notre progression!</li>
                <li>🚀 Reste connecté pour suivre nos exploits tout au long de l'année {currentYear}!</li>
                <li>✨ Ensemble, nous créons la magie!</li>
              </ul>
            </div>

            <div style={styles.callToAction}>
              <p style={styles.ctaText}>Veux-tu suivre notre progression? 👇</p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => navigate("/welcome")}
                  style={styles.primaryButton}
                >
                  📋 Nouveau Formulaire
                </button>
                <button
                  onClick={() => navigate("/navigate")}
                  style={styles.secondaryButton}
                >
                  🌐 Retour à l'Accueil
                </button>
              </div>
            </div>

            <div style={styles.celebration}>
              <p style={styles.celebrationText}>
                ✨ Merci d'être part de notre communauté! ✨
              </p>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            L'Écho Personnalisé © {currentYear} | Nexus Connecté
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
    position: "relative",
    display: "flex",
    overflow: "hidden",
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
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "60px 40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    animation: "slideIn 0.5s ease",
  },
  emoji: {
    fontSize: "80px",
    marginBottom: "20px",
    animation: "bounce 0.6s ease",
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 20px 0",
  },
  message: {
    fontSize: "16px",
    color: "#444",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  impactBox: {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
    borderLeft: "4px solid #667eea",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    textAlign: "left",
  },
  impactTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#667eea",
    margin: "0 0 10px 0",
  },
  impactText: {
    fontSize: "15px",
    color: "#555",
    margin: 0,
    lineHeight: "1.5",
  },
  yearSection: {
    background: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "30px",
    textAlign: "left",
  },
  yearTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 15px 0",
  },
  yearList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  callToAction: {
    margin: "30px 0",
  },
  ctaText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#667eea",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "600",
    background: "white",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  celebration: {
    marginTop: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "8px",
    color: "white",
  },
  celebrationText: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  footer: {
    textAlign: "center",
    padding: "30px 20px",
    color: "white",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.9,
  },
  detailsBox: {
    background: "linear-gradient(135deg, rgba(82, 39, 255, 0.15) 0%, rgba(74, 90, 181, 0.15) 100%)",
    border: "1px solid rgba(82, 39, 255, 0.3)",
    borderRadius: "15px",
    padding: "30px",
    marginTop: "30px",
    marginBottom: "30px",
  },
  detailsTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#82b1ff",
    margin: "0 0 20px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  detailField: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    padding: "15px",
    background: "rgba(10, 14, 39, 0.4)",
    borderRadius: "10px",
    border: "1px solid rgba(82, 39, 255, 0.2)",
  },
  detailIcon: {
    fontSize: "24px",
    flexShrink: 0,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#b0c4ff",
    margin: "0 0 5px 0",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  detailValue: {
    fontSize: "14px",
    color: "#e8ecff",
    margin: 0,
    wordBreak: "break-word",
  },
};

export default Confirmation;
