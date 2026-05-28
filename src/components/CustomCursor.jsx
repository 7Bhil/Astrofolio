import React, { useEffect, useRef } from 'react';
import '../styles/CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outer = outerRef.current;
    if (!dot || !outer) return;

    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animate = () => {
      // Smooth lerp for outer cursor
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;
      requestAnimationFrame(animate);
    };

    const onMouseDown = () => {
      dot.classList.add('clicking');
      outer.classList.add('clicking');
    };

    const onMouseUp = () => {
      dot.classList.remove('clicking');
      outer.classList.remove('clicking');
    };

    const handleHover = () => {
      const targets = document.querySelectorAll('a, button, .skill-tag, .project-card, .bento-item, .orbit-icon');
      targets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          dot.classList.add('hover');
          outer.classList.add('hover');
        });
        target.addEventListener('mouseleave', () => {
          dot.classList.remove('hover');
          outer.classList.remove('hover');
        });
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    const animationFrame = requestAnimationFrame(animate);
    handleHover();

    // Re-bind hover on dynamic content changes
    const observer = new MutationObserver(handleHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={outerRef} className="custom-cursor-outer" />
    </>
  );
};

export default CustomCursor;
