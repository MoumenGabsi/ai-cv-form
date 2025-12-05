import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ASCIIText from './ASCIIText';

export default function ASCIIPortal() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    setIsExiting(true);
    // Wait for animation to complete
    setTimeout(() => {
      navigate('/nexus');
    }, 600);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={styles.container}>
      {/* ASCII Text Portal */}
      <div style={{ ...styles.asciiWrapper, opacity: isExiting ? 0 : 1 }}>
        <ASCIIText
          text="NUIT_D_INFO"
          enableWaves={true}
          asciiFontSize={6}
          textFontSize={80}
          textColor="#5227FF"
          planeBaseHeight={5}
        />
      </div>

      {/* Click Indicator */}
      <div style={{ ...styles.clickIndicator, opacity: isExiting ? 0 : 0.7 }}>
        <p style={styles.clickText}>Click anywhere to enter</p>
      </div>

      {/* Ripple Effect on Click */}
      {isExiting && (
        <div style={styles.ripple}>
          <div style={styles.rippleInner}></div>
        </div>
      )}

      {/* Invisible Clickable Layer */}
      <div
        onClick={handleClick}
        style={styles.clickLayer}
        title="Click to enter Nexus"
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0a0e27',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asciiWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transition: 'opacity 0.6s ease-out',
    zIndex: 1,
  },
  clickIndicator: {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    transition: 'opacity 0.4s ease-out',
    textAlign: 'center',
  },
  clickText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    animation: 'pulse 2s infinite',
  },
  ripple: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    zIndex: 5,
    pointerEvents: 'none',
  },
  rippleInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '3px solid #5227FF',
    animation: 'rippleExpand 0.6s ease-out',
  },
  clickLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    zIndex: 2,
  },
};

// Add animations to document if not already present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.1);
      }
    }

    @keyframes rippleExpand {
      0% {
        width: 100px;
        height: 100px;
        opacity: 1;
        border-color: #5227FF;
      }
      100% {
        width: 800px;
        height: 800px;
        opacity: 0;
        border-color: rgba(82, 39, 255, 0);
      }
    }
  `;
  document.head.appendChild(style);
}
