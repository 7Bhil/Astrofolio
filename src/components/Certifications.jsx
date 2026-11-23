import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Code2, 
  Terminal, 
  Network, 
  Database, 
  Eye, 
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal
} from 'lucide-react';
import '../styles/Certifications.css';

const certificationsList = [
  {
    id: 'html-css',
    title: 'HTML5 & Modern CSS3',
    issuer: 'Web Development Institute',
    category: 'Frontend & UI Design',
    categoryKey: 'frontend',
    issueDate: 'Certifié',
    badgeText: 'Web Core',
    icon: Code2,
    accentColor: '#38bdf8', // cyan
    image: '/Certifications/certification html && css.webp',
    description: 'Architecture sémantique moderne, responsive design, animations et layouts CSS Grid & Flexbox.'
  },
  {
    id: 'js',
    title: 'JavaScript Modern (ES6+)',
    issuer: 'JavaScript Certification Board',
    category: 'Frontend & Logic',
    categoryKey: 'frontend',
    issueDate: 'Certifié',
    badgeText: 'Programming',
    icon: Code2,
    accentColor: '#facc15', // amber/yellow
    image: '/Certifications/certification js.webp',
    description: 'Programmation asynchrone, DOM manipulation, paradigmes fonctionnels et architectures modulaires.'
  },
  {
    id: 'php-mysql',
    title: 'PHP & MySQL Architecture',
    issuer: 'Backend & DB Authority',
    category: 'Backend & Database',
    categoryKey: 'backend',
    issueDate: 'Certifié',
    badgeText: 'Full-Stack Data',
    icon: Database,
    accentColor: '#818cf8', // indigo
    image: '/Certifications/certification php && Mysql.webp',
    description: 'Conception de bases relationnelles, requêtes optimisées, transactions et APIs serveurs sécurisées.'
  },
  {
    id: 'python',
    title: 'Python Core & Scripting',
    issuer: 'Python Software Foundation Path',
    category: 'Backend & Automation',
    categoryKey: 'systems',
    issueDate: 'Certifié',
    badgeText: 'Data & Systems',
    icon: Terminal,
    accentColor: '#34d399', // emerald
    image: '/Certifications/certification python.webp',
    description: 'Structures de données avancées, automatisation système, manipulation de flux et algorithmique.'
  },
  {
    id: 'c',
    title: 'C Programming & Systems',
    issuer: 'Systems Engineering Academy',
    category: 'Low-Level & Algorithms',
    categoryKey: 'systems',
    issueDate: 'Certifié',
    badgeText: 'Low-Level Core',
    icon: Terminal,
    accentColor: '#60a5fa', // sky/blue
    image: '/Certifications/certification C.webp',
    description: 'Gestion de la mémoire vive, pointeurs, structures de données natives et logique bas niveau.'
  },
  {
    id: 'linux',
    title: 'Linux System Administration',
    issuer: 'Open Source Systems Body',
    category: 'DevOps & Systems',
    categoryKey: 'systems',
    issueDate: 'Certifié',
    badgeText: 'Infrastructure',
    icon: Terminal,
    accentColor: '#fb923c', // orange
    image: '/Certifications/certification linux.webp',
    description: 'Administration système, permissions, scripting Bash, gestion de processus et sécurité réseau.'
  },
  {
    id: 'reseau1',
    title: 'Networking Concepts & Protocols',
    issuer: 'Network Architecture Academy',
    category: 'Networks & Security',
    categoryKey: 'network',
    issueDate: 'Certifié',
    badgeText: 'Routing & Layers',
    icon: Network,
    accentColor: '#38bdf8', // cyan
    image: '/Certifications/certification reseau.webp',
    description: 'Modèles OSI / TCP-IP, routage, sous-réseaux IP, protocoles de communication et flux réseau.'
  },
  {
    id: 'reseau2',
    title: 'Advanced Networking & Security',
    issuer: 'Advanced Telecom Infrastructure',
    category: 'Networks & Security',
    categoryKey: 'network',
    issueDate: 'Certifié',
    badgeText: 'Infrastructure Sec',
    icon: Network,
    accentColor: '#a78bfa', // purple
    image: '/Certifications/certification reseau2.webp',
    description: 'Topologies d’infrastructure avancées, commutation, sécurité des passerelles et diagnostic réseau.'
  }
];

const categories = [
  { id: 'all', label: 'Toutes les certifications' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend & DB' },
  { id: 'network', label: 'Réseaux' },
  { id: 'systems', label: 'Systèmes & C' }
];

const SWIPE_THRESHOLD = 75;

const StackCard = ({ cert, stackPosition, total, swipeDirection, onSwipe, onOpenModal }) => {
  const isFront = stackPosition === 0;
  const x = useMotionValue(0);
  const rotateDrag = useTransform(x, [-240, 0, 240], [-14, 0, 14]);
  const [wasDragged, setWasDragged] = useState(false);

  const scale = 1 - stackPosition * 0.055;
  const offsetX = stackPosition * 18;
  const offsetY = stackPosition * 14;
  const baseRotate = stackPosition * 3;
  const opacity = Math.max(0.25, 1 - stackPosition * 0.22);

  const handleDragStart = () => {
    setWasDragged(true);
  };

  const handleDragEnd = (_, info) => {
    const swipedLeft = info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400;
    const swipedRight = info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400;

    if (swipedLeft) {
      onSwipe(1);
    } else if (swipedRight) {
      onSwipe(-1);
    }

    setTimeout(() => setWasDragged(false), 120);
  };

  const handleClick = () => {
    if (isFront && !wasDragged) {
      onOpenModal(cert);
    }
  };

  return (
    <motion.div
      className={`cert-stack-card ${isFront ? 'is-front' : ''}`}
      custom={swipeDirection}
      style={{
        '--card-accent': cert.accentColor,
        zIndex: 20 - stackPosition,
        x: isFront ? x : offsetX,
        rotate: isFront ? rotateDrag : baseRotate,
        cursor: isFront ? (total > 1 ? 'grab' : 'pointer') : 'default',
      }}
      initial={(dir) => ({
        scale: dir < 0 && isFront ? 1 : 0.88,
        opacity: 0,
        x: dir < 0 && isFront ? 240 : offsetX + 16,
        y: dir < 0 && isFront ? 0 : offsetY + 14,
        rotate: dir < 0 && isFront ? 12 : baseRotate + 3,
      })}
      animate={{
        scale,
        opacity,
        x: isFront ? 0 : offsetX,
        y: offsetY,
        rotate: isFront ? 0 : baseRotate,
      }}
      exit={(dir) => ({
        x: dir >= 0 ? -280 : 280,
        opacity: 0,
        rotate: dir >= 0 ? -16 : 16,
        transition: { duration: 0.24 },
      })}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
      }}
      drag={isFront && total > 1 ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="cert-top-glow" />

      <div className="cert-stack-image-wrap">
        <img
          src={cert.image}
          alt={`Diplôme ${cert.title}`}
          className="cert-stack-image"
          draggable={false}
          loading="lazy"
        />
        <div className="cert-stack-image-fade" />
      </div>

      <div className="cert-stack-card-meta">
        <span className="cert-stack-badge">{cert.badgeText}</span>
        <div className="cert-verified-badge" title="Diplôme / Attestation vérifiée">
          <ShieldCheck size={13} />
          <span>Vérifié</span>
        </div>
      </div>

      {isFront && total > 1 && (
        <div className="cert-swipe-hint" aria-hidden="true">
          <MoveHorizontal size={13} />
          <span>Glisser</span>
        </div>
      )}
    </motion.div>
  );
};

const Certifications = ({ t = {} }) => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(1);

  const filteredCerts = activeCategory === 'all'
    ? certificationsList
    : certificationsList.filter(c => c.categoryKey === activeCategory);

  const safeIndex = filteredCerts.length > 0 ? activeIndex % filteredCerts.length : 0;
  const activeCert = filteredCerts[safeIndex];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveIndex(0);
    setSwipeDirection(1);
  };

  const handleSwipe = useCallback((direction) => {
    if (filteredCerts.length <= 1) return;
    setSwipeDirection(direction);
    setActiveIndex((prev) => (prev + direction + filteredCerts.length) % filteredCerts.length);
  }, [filteredCerts.length]);

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  // Handle escape key to close modal, and left/right arrows for stack navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      } else if (!selectedCert) {
        if (e.key === 'ArrowRight') handleSwipe(1);
        if (e.key === 'ArrowLeft') handleSwipe(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert, handleSwipe]);

  const openModal = (cert, e) => {
    if (e) e.stopPropagation();
    setSelectedCert(cert);
  };

  const closeModal = () => {
    setSelectedCert(null);
  };

  // Build visible stack (up to 4 cards)
  const visibleCount = Math.min(4, filteredCerts.length);
  const stackCards = Array.from({ length: visibleCount }, (_, i) => {
    const certIndex = (safeIndex + i) % filteredCerts.length;
    return {
      cert: filteredCerts[certIndex],
      stackPosition: i,
    };
  });

  const ActiveIcon = activeCert?.icon || Award;

  return (
    <section id="certifications" className="certifications-section">
      {/* Decorative ambient gradient backdrop */}
      <div className="certs-ambient-glow" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal">
          <div className="certs-pill-badge">
            <Award size={14} className="certs-pill-icon" />
            <span>Accréditations & Compétences Validées</span>
          </div>
          <h2 className="section-title">
            {t.title || 'Certifications & Diplômes'}
          </h2>
          <p className="section-subtitle">
            {t.subtitle || 'Parcours technique certifié garantissant rigueur, maîtrise des standards et expertise vérifiée.'}
          </p>
        </div>

        {/* Filter categories tabs */}
        <div className="certs-filter-bar reveal">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`certs-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.id === 'all' ? <Layers size={14} /> : null}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Card Stack + Synchronized Details Panel */}
        {activeCert && (
          <div className="certs-showcase reveal">
            {/* Left: Interactive Card Stack */}
            <div className="certs-stack-stage" aria-label="Pile interactive de certifications">
              <AnimatePresence initial={false} custom={swipeDirection}>
                {stackCards.slice().reverse().map(({ cert, stackPosition }) => (
                  <StackCard
                    key={cert.id}
                    cert={cert}
                    stackPosition={stackPosition}
                    total={filteredCerts.length}
                    swipeDirection={swipeDirection}
                    onSwipe={handleSwipe}
                    onOpenModal={openModal}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Right: Synchronized Info Panel */}
            <div className="certs-details-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCert.id}
                  className="certs-details-content"
                  style={{ '--card-accent': activeCert.accentColor }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  <div className="certs-details-top">
                    <div className="cert-icon-wrapper">
                      <ActiveIcon size={22} className="cert-main-icon" />
                    </div>
                    <div className="certs-details-badges">
                      <span className="cert-category-tag">{activeCert.category}</span>
                      <span className="cert-badge-pill">{activeCert.badgeText}</span>
                    </div>
                  </div>

                  <h3 className="certs-details-title">{activeCert.title}</h3>
                  <p className="certs-details-issuer">{activeCert.issuer}</p>
                  <p className="certs-details-description">{activeCert.description}</p>

                  <div className="certs-details-actions">
                    <button
                      type="button"
                      className="cert-view-btn certs-details-view-btn"
                      onClick={(e) => openModal(activeCert, e)}
                    >
                      <Eye size={16} />
                      <span>{t.viewFull || 'Voir le diplôme'}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls: Prev / Dots + Counter / Next */}
              {filteredCerts.length > 1 && (
                <div className="certs-stack-controls">
                  <div className="certs-nav-buttons">
                    <button
                      type="button"
                      className="certs-nav-btn"
                      onClick={() => handleSwipe(-1)}
                      aria-label="Certification précédente"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="certs-nav-btn"
                      onClick={() => handleSwipe(1)}
                      aria-label="Certification suivante"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="certs-dots" role="tablist" aria-label="Sélectionner une certification">
                    {filteredCerts.map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === safeIndex}
                        aria-label={`Afficher ${c.title}`}
                        className={`certs-dot ${idx === safeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                      />
                    ))}
                  </div>

                  <span className="certs-counter">
                    {String(safeIndex + 1).padStart(2, '0')} / {String(filteredCerts.length).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal Dialog */}
      <div 
        className={`cert-modal-overlay ${selectedCert ? 'open' : ''}`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-label="Aperçu du certificat"
      >
        <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="cert-modal-header">
            <div className="cert-modal-meta">
              <span className="cert-modal-tag">{selectedCert?.category}</span>
              <h3 className="cert-modal-title">{selectedCert?.title}</h3>
              <p className="cert-modal-subtitle">
                <CheckCircle2 size={15} className="cert-modal-check" />
                Délivré par {selectedCert?.issuer}
              </p>
            </div>
            <button 
              className="cert-modal-close" 
              onClick={closeModal} 
              aria-label={t.closeModal || 'Fermer la fenêtre'}
            >
              <X size={20} />
            </button>
          </div>

          <div className="cert-modal-image-wrapper">
            {selectedCert && (
              <img 
                src={selectedCert.image} 
                alt={`Diplôme ${selectedCert.title}`} 
                className="cert-modal-image" 
                loading="eager"
              />
            )}
          </div>

          <div className="cert-modal-footer">
            <div className="cert-modal-foot-info">
              <Sparkles size={16} className="text-cyan-400" />
              <span>Accréditation officielle 7Bhil Portfolio</span>
            </div>
            {selectedCert && (
              <a
                href={selectedCert.image}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-modal-link-btn"
              >
                <span>Ouvrir en plein écran</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
