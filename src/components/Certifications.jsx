import React, { useState, useEffect } from 'react';
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
  Layers
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

const Certifications = ({ t = {} }) => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (cert, e) => {
    if (e) e.stopPropagation();
    setSelectedCert(cert);
  };

  const closeModal = () => {
    setSelectedCert(null);
  };

  const filteredCerts = activeCategory === 'all'
    ? certificationsList
    : certificationsList.filter(c => c.categoryKey === activeCategory);

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
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.id === 'all' ? <Layers size={14} /> : null}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Certifications Cards Grid */}
        <div className="certifications-grid">
          {filteredCerts.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <div 
                key={cert.id} 
                className="cert-card reveal" 
                style={{ 
                  transitionDelay: `${index * 0.05}s`,
                  '--card-accent': cert.accentColor 
                }}
                onClick={() => openModal(cert)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(cert); }}
                aria-label={`Voir le certificat ${cert.title}`}
              >
                {/* Subtle top indicator bar */}
                <div className="cert-top-glow" />

                {/* Card Header: Icon + Verified Badge */}
                <div className="cert-card-header">
                  <div className="cert-icon-wrapper">
                    <IconComponent size={22} className="cert-main-icon" />
                  </div>
                  <div className="cert-verified-badge" title="Diplôme / Attestation vérifiée">
                    <ShieldCheck size={14} />
                    <span>Vérifié</span>
                  </div>
                </div>

                {/* Card Body: Title, Issuer, Category */}
                <div className="cert-card-body">
                  <span className="cert-category-tag">{cert.category}</span>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-description">{cert.description}</p>
                </div>

                {/* Card Footer: Subtle preview link & modal trigger */}
                <div className="cert-card-footer">
                  <span className="cert-badge-pill">{cert.badgeText}</span>
                  <button 
                    type="button"
                    className="cert-view-btn"
                    onClick={(e) => openModal(cert, e)}
                    aria-label={`Aperçu du diplôme ${cert.title}`}
                  >
                    <Eye size={15} />
                    <span>{t.viewFull || 'Voir le diplôme'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
