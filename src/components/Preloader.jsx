import { useState, useEffect } from 'react';
import logo from '../assets/1mind.jpg';

function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="logo-container">
          <div className="logo-circle">
            <img src={logo} alt="1MindExch" className="preloader-logo" />
          </div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring-2"></div>
        </div>
        
        <h2 className="brand-name">1MINDEXCH</h2>
        <p className="tagline">Premium Exchange Platform</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
        
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className="preloader-bg-animation"></div>
    </div>
  );
}

export default Preloader;