import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = ({ lang, translations }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations;
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.skills'), href: '#skills' },
  ];

  const otherLangUrl = lang === 'fr' ? '/en/' : '/';
  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#home" className={`logo ${isScrolled ? 'logo-scrolled' : ''}`}>
          <span className="text-cyan">7</span>Bhil
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop glass-panel floating-pill">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="nav-link">{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`nav-actions-desktop ${isScrolled ? 'actions-scrolled' : ''}`}>
          <div className="nav-controls">
            <a href={otherLangUrl} className="icon-btn" aria-label={t('nav.switchLanguage')}>
              <Globe size={18} />
              <span className="lang-text">{lang.toUpperCase()}</span>
            </a>
            <button onClick={toggleTheme} className="icon-btn" aria-label={t('nav.toggleTheme')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <a href="#contact" className="btn btn-primary btn-sm rounded-pill">
            {t('nav.contact')}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="nav-mobile-toggle">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="menu-toggle"
            aria-label={t('nav.openMenu')}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-mobile-controls">
          <a href={otherLangUrl} className="icon-btn">
            <Globe size={18} />
            <span className="lang-text">{lang.toUpperCase()}</span>
          </a>
          <button onClick={toggleTheme} className="icon-btn" aria-label={t('nav.toggleTheme')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <ul className="nav-mobile-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="nav-mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
             <a href="#contact" className="nav-mobile-link text-accent" onClick={() => setIsMobileMenuOpen(false)}>
               {t('nav.contact')}
             </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
