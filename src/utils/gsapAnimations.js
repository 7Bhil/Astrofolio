import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  if (typeof window === 'undefined') return;

  // 1. Profile photo entrance
  gsap.from('.profile-image-wrapper', {
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    ease: 'back.out(1.5)',
    delay: 0.3
  });

  // 2. Section Titles Reveal on Scroll
  const sectionHeaders = document.querySelectorAll('.section-header, .section-title');
  sectionHeaders.forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // 3. Cards & project items stagger animation on scroll
  const projectCards = document.querySelectorAll('.project-card, .service-card, .skill-category');
  if (projectCards.length > 0) {
    ScrollTrigger.batch(projectCards, {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out'
        });
      },
      once: true
    });
  }
}

