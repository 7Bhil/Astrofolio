import React, { useEffect, useState } from 'react';
import '../styles/ScrollProgress.css';

const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollPercentage(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress-container">
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollPercentage}%` }}
      >
        <div className="scroll-progress-glow"></div>
      </div>
    </div>
  );
};

export default ScrollProgress;
