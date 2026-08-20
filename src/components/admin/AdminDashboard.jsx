import React, { useState, useEffect } from 'react';
import { 
  authApi, 
  projectsApi, 
  skillsApi, 
  experiencesApi, 
  messagesApi, 
  statsApi, 
  removeAuthToken 
} from '../../services/api';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Database,
  Globe,
  Menu,
  X,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import '../../styles/Admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    slug: '',
    titleFr: '',
    titleEn: '',
    descFr: '',
    descEn: '',
    category: 'web',
    githubUrl: '',
    demoUrl: '',
    featured: true,
    order: 0
  });

  const [skillForm, setSkillForm] = useState({ name: '', category: 'frontend', level: 90 });
  const [showSkillModal, setShowSkillModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Initial authentication check & data load
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    setLoading(true);
    try {
      const userData = await authApi.getMe();
      setUser(userData.user);
      await loadDashboardData();
    } catch (err) {
      console.error("Auth error:", err);
      window.location.href = '/admin';
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [statsRes, projectsRes, skillsRes, expRes, msgRes] = await Promise.all([
        statsApi.getStats().catch(() => null),
        projectsApi.getAll().catch(() => []),
        skillsApi.getAll().catch(() => []),
        experiencesApi.getAll().catch(() => []),
        messagesApi.getAll().catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      if (projectsRes) setProjects(projectsRes);
      if (skillsRes) setSkills(skillsRes);
      if (expRes) setExperiences(expRes);
      if (msgRes) setMessages(msgRes);
    } catch (err) {
      showAlert('danger', 'Erreur lors du chargement des données.');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/admin';
  };

  // --- PROJECT ACTIONS ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, projectForm);
        showAlert('success', 'Projet mis à jour avec succès !');
      } else {
        await projectsApi.create(projectForm);
        showAlert('success', 'Nouveau projet créé avec succès !');
      }
      setShowProjectModal(false);
      setEditingProject(null);
      resetProjectForm();
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.message || 'Erreur lors de l\'enregistrement du projet.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      await projectsApi.delete(id);
      showAlert('success', 'Projet supprimé !');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Erreur lors de la suppression.');
    }
  };

  const openEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      slug: proj.slug || '',
      titleFr: proj.titleFr || '',
      titleEn: proj.titleEn || '',
      descFr: proj.descFr || '',
      descEn: proj.descEn || '',
      category: proj.category || 'web',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      featured: proj.featured !== undefined ? proj.featured : true,
      order: proj.order || 0
    });
    setShowProjectModal(true);
  };

  const resetProjectForm = () => {
    setProjectForm({
      slug: '',
      titleFr: '',
      titleEn: '',
      descFr: '',
      descEn: '',
      category: 'web',
      githubUrl: '',
      demoUrl: '',
      featured: true,
      order: 0
    });
  };

  // --- SKILL ACTIONS ---
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      await skillsApi.create(skillForm);
      showAlert('success', 'Compétence ajoutée !');
      setShowSkillModal(false);
      setSkillForm({ name: '', category: 'frontend', level: 90 });
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Erreur lors de l\'ajout de la compétence.');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;
    try {
      await skillsApi.delete(id);
      showAlert('success', 'Compétence supprimée.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Erreur lors de la suppression.');
    }
  };

  // --- MESSAGE ACTIONS ---
  const handleMarkMessageRead = async (id, read) => {
    try {
      await messagesApi.markRead(id, read);
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Erreur lors de la mise à jour.');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await messagesApi.delete(id);
      showAlert('success', 'Message supprimé.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Erreur de suppression.');
    }
  };

  // --- SECURITY ACTIONS ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert('danger', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    try {
      await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showAlert('success', 'Mot de passe modifié avec succès !');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showAlert('danger', err.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#060b18', color: '#fff' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>Chargement du panneau d'administration...</span>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="admin-layout">

      {/* MOBILE TOP BAR */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-brand">
          <div className="admin-brand-icon">7B</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Admin 7Bhil</h3>
            <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>PostgreSQL Neon</span>
          </div>
        </div>
        <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* MOBILE BACKDROP OVERLAY */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* SIDEBAR NAVIGATION */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">7B</div>
          <div>
            <h3>Portfolio Admin</h3>
            <span>Neon PostgreSQL</span>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'projects', label: 'Projets', icon: FolderGit2, count: projects.length },
            { id: 'skills', label: 'Compétences', icon: Wrench, count: skills.length },
            { id: 'experiences', label: 'Parcours', icon: Briefcase, count: experiences.length },
            { id: 'messages', label: 'Messages', icon: Mail, count: unreadCount, isUnread: unreadCount > 0 },
            { id: 'security', label: 'Sécurité & Accès', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`admin-nav-badge ${tab.isUnread ? 'unread' : ''}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            Connecté en tant que:<br />
            <strong>{user?.email}</strong>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        
        {/* HEADER BAR */}
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>
              {activeTab === 'overview' && 'Vue d\'ensemble'}
              {activeTab === 'projects' && 'Gestion des Projets'}
              {activeTab === 'skills' && 'Gestion des Compétences'}
              {activeTab === 'experiences' && 'Parcours & Formations'}
              {activeTab === 'messages' && 'Messages Reçus'}
              {activeTab === 'security' && 'Sécurité & Identifiants'}
            </h1>
            <p>
              Base de données Neon PostgreSQL • Admin Panel
            </p>
          </div>

          <div className="admin-header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-admin-secondary">
              <Globe size={16} /> Voir le site
            </a>
            <button onClick={loadDashboardData} className="btn-admin-secondary">
              <RefreshCw size={16} /> Actualiser
            </button>
          </div>
        </header>

        {/* ALERTS NOTIFICATION */}
        {alert && (
          <div style={{
            padding: '0.9rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            background: alert.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: alert.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: alert.type === 'success' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500
          }}>
            {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{alert.message}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span>Projets Réalisés</span>
                  <FolderGit2 size={20} color="#2563eb" />
                </div>
                <div className="admin-kpi-value">{projects.length}</div>
                <span className="admin-kpi-subtitle">Stockés sur Neon DB</span>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span>Compétences</span>
                  <Wrench size={20} color="#06b6d4" />
                </div>
                <div className="admin-kpi-value">{skills.length}</div>
                <span className="admin-kpi-subtitle">Stack Technique</span>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span>Messages Reçus</span>
                  <Mail size={20} color="#8b5cf6" />
                </div>
                <div className="admin-kpi-value">{messages.length}</div>
                <span className="admin-kpi-subtitle" style={{ color: unreadCount > 0 ? '#fbbf24' : '#06b6d4' }}>
                  {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tous lus'}
                </span>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span>Base de Données</span>
                  <Database size={20} color="#10b981" />
                </div>
                <div className="admin-kpi-value" style={{ fontSize: '1.25rem', marginTop: '0.4rem', color: '#4ade80' }}>
                  PostgreSQL Neon
                </div>
                <span className="admin-kpi-subtitle">Cloud AWS Pooler</span>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="admin-panel">
              <h3 className="admin-panel-title">Actions Rapides</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTab('projects'); setShowProjectModal(true); }} className="btn-admin-primary">
                  <Plus size={18} /> Ajouter un Projet
                </button>
                <button onClick={() => { setActiveTab('skills'); setShowSkillModal(true); }} className="btn-admin-secondary">
                  <Plus size={18} /> Ajouter une Compétence
                </button>
                <button onClick={() => setActiveTab('messages')} className="btn-admin-secondary">
                  <Mail size={18} /> Messages ({unreadCount})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div>
            <div className="admin-panel-title">
              <span>Projets Catalogués ({projects.length})</span>
              <button onClick={() => { resetProjectForm(); setEditingProject(null); setShowProjectModal(true); }} className="btn-admin-primary">
                <Plus size={18} /> Nouveau Projet
              </button>
            </div>

            <div>
              {projects.map(proj => (
                <div key={proj.id} className="admin-item-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{proj.titleFr}</strong>
                      <span className="admin-tag admin-tag-blue">{proj.category}</span>
                      {proj.featured && <span className="admin-tag admin-tag-gold">⭐ Vedette</span>}
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>{proj.descFr}</p>
                  </div>

                  <div className="admin-item-card-actions">
                    <button onClick={() => openEditProject(proj)} className="btn-icon-edit" title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProject(proj.id)} className="btn-icon-danger" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PROJECT MODAL */}
            {showProjectModal && (
              <div className="admin-modal-backdrop" onClick={() => setShowProjectModal(false)}>
                <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
                  <h3 className="admin-panel-title">
                    <span>{editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</span>
                    <button onClick={() => setShowProjectModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </h3>
                  
                  <form onSubmit={handleSaveProject}>
                    <div className="admin-form-group">
                      <label>Slug unique</label>
                      <input 
                        type="text" 
                        value={projectForm.slug} 
                        onChange={e => setProjectForm({...projectForm, slug: e.target.value})} 
                        required 
                        className="admin-input" 
                        placeholder="mon-projet" 
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label>Titre (FR)</label>
                        <input type="text" value={projectForm.titleFr} onChange={e => setProjectForm({...projectForm, titleFr: e.target.value})} required className="admin-input" />
                      </div>
                      <div className="admin-form-group">
                        <label>Title (EN)</label>
                        <input type="text" value={projectForm.titleEn} onChange={e => setProjectForm({...projectForm, titleEn: e.target.value})} required className="admin-input" />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Description (FR)</label>
                      <textarea value={projectForm.descFr} onChange={e => setProjectForm({...projectForm, descFr: e.target.value})} required className="admin-textarea" />
                    </div>

                    <div className="admin-form-group">
                      <label>Description (EN)</label>
                      <textarea value={projectForm.descEn} onChange={e => setProjectForm({...projectForm, descEn: e.target.value})} required className="admin-textarea" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label>Lien GitHub</label>
                        <input type="text" value={projectForm.githubUrl} onChange={e => setProjectForm({...projectForm, githubUrl: e.target.value})} className="admin-input" placeholder="https://github.com/..." />
                      </div>
                      <div className="admin-form-group">
                        <label>Lien Démo</label>
                        <input type="text" value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} className="admin-input" placeholder="https://..." />
                      </div>
                    </div>

                    <div style={{ margin: '1rem 0' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                        Mettre en vedette
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button type="button" onClick={() => setShowProjectModal(false)} className="btn-admin-secondary">
                        Annuler
                      </button>
                      <button type="submit" className="btn-admin-primary">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div>
            <div className="admin-panel-title">
              <span>Compétences ({skills.length})</span>
              <button onClick={() => setShowSkillModal(true)} className="btn-admin-primary">
                <Plus size={18} /> Ajouter une compétence
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {skills.map(sk => (
                <div key={sk.id} className="admin-item-card" style={{ marginBottom: 0 }}>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#fff' }}>{sk.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                      {sk.category} • {sk.level}%
                    </div>
                  </div>
                  <button onClick={() => handleDeleteSkill(sk.id)} className="btn-icon-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* SKILL MODAL */}
            {showSkillModal && (
              <div className="admin-modal-backdrop" onClick={() => setShowSkillModal(false)}>
                <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                  <h3 className="admin-panel-title">
                    <span>Ajouter une compétence</span>
                    <button onClick={() => setShowSkillModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </h3>

                  <form onSubmit={handleSaveSkill}>
                    <div className="admin-form-group">
                      <label>Nom de la compétence</label>
                      <input 
                        type="text" 
                        value={skillForm.name} 
                        onChange={e => setSkillForm({...skillForm, name: e.target.value})} 
                        required 
                        className="admin-input" 
                        placeholder="Ex: React Native" 
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Catégorie</label>
                      <select 
                        value={skillForm.category} 
                        onChange={e => setSkillForm({...skillForm, category: e.target.value})} 
                        className="admin-select"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend & DB</option>
                        <option value="mobile">Mobile</option>
                        <option value="tools_security">Cybersécurité & Outils</option>
                        <option value="fintech">Fintech & Paiement</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button type="button" onClick={() => setShowSkillModal(false)} className="btn-admin-secondary">
                        Annuler
                      </button>
                      <button type="submit" className="btn-admin-primary">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div>
            <h3 className="admin-panel-title">Boîte de Réception des Messages ({messages.length})</h3>
            {messages.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Aucun message reçu pour le moment.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className="admin-panel" 
                    style={{ 
                      borderColor: msg.read ? 'rgba(255,255,255,0.08)' : 'rgba(6,182,212,0.4)',
                      background: msg.read ? 'rgba(11, 19, 41, 0.6)' : 'rgba(6, 182, 212, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{msg.name}</strong> 
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginLeft: '0.5rem' }}>({msg.email})</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(msg.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    
                    {msg.subject && (
                      <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.5rem' }}>
                        Sujet: {msg.subject}
                      </div>
                    )}

                    <p style={{ background: '#060b18', padding: '0.85rem', borderRadius: '8px', margin: '0.75rem 0', whiteSpace: 'pre-wrap', lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.06)' }}>
                      {msg.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button onClick={() => handleMarkMessageRead(msg.id, !msg.read)} className="btn-admin-secondary" style={{ fontSize: '0.82rem' }}>
                        {msg.read ? 'Marquer non lu' : 'Marquer comme lu'}
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="btn-icon-danger" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY SETTINGS */}
        {activeTab === 'security' && (
          <div style={{ maxWidth: '520px' }}>
            <div className="admin-panel">
              <h3 className="admin-panel-title">Changer le mot de passe</h3>
              <form onSubmit={handleChangePassword}>
                <div className="admin-form-group">
                  <label>Mot de passe actuel</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                    required 
                    className="admin-input" 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                    required 
                    className="admin-input" 
                  />
                </div>
                <div className="admin-form-group">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword} 
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                    required 
                    className="admin-input" 
                  />
                </div>

                <button type="submit" className="btn-admin-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  Mettre à jour le mot de passe
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
