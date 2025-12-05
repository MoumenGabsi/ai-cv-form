import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import DotGrid from './DotGrid';

export default function PageModal() {
  const navigate = useNavigate();

  const handleSelectPage = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      {/* DotGrid Background */}
      <div style={styles.dotGridWrapper}>
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

      {/* Content Container - Centered */}
      <div style={styles.content}>
        {/* HOME BUTTON */}
        <button 
          onClick={() => navigate('/navigate')}
          style={styles.homeBtn}
        >
          🏠 Home
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>🌐 Nexus Connecté</h1>
          <p style={styles.subtitle}>Choose your destination and begin your journey</p>
        </div>

        <div style={styles.carouselContainer}>
          <Carousel
            baseWidth={750}
            autoplay={false}
            pauseOnHover={true}
            loop={false}
            round={false}
            onSelectItem={handleSelectPage}
          />
        </div>

        <div style={styles.instructions}>
          <p>🖱️ Drag to browse • Click to navigate • Scroll indicators to jump</p>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
    backgroundColor: "#0a0e27",
  },
  dotGridWrapper: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    backgroundColor: "#0a0e27",
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "800px",
    padding: "20px",
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
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
    animation: "slideInDown 0.6s ease",
  },
  title: {
    fontSize: "64px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "22px",
    margin: 0,
    opacity: 0.95,
    fontWeight: "300",
  },
  carouselContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0 20px 0",
    minHeight: "auto",
  },
  instructions: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    marginTop: "30px",
    fontWeight: "500",
  },
};
