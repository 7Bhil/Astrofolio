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
  ExternalLink,
  Globe,
  Sparkles,
  Search,
  Eye
} from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#030712', color: '#fff' }}>
        <RefreshCw size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>Chargement du panneau d'administration...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ width: '260px', background: 'rgba(15, 23, 42, 0.8)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-[#2563eb,#3b82f6]', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            7B
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Portfolio Admin</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Neon PostgreSQL</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'projects', label: 'Projets', icon: FolderGit2, count: projects.length },
            { id: 'skills', label: 'Compétences', icon: Wrench, count: skills.length },
            { id: 'experiences', label: 'Parcours', icon: Briefcase, count: experiences.length },
            { id: 'messages', label: 'Messages', icon: Mail, count: messages.filter(m => !m.read).length },
            { id: 'security', label: 'Sécurité & Accès', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{ background: isActive ? '#2563eb' : 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Connecté en tant que:<br />
            <strong style={{ color: '#fff' }}>{user?.email}</strong>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        
        {/* HEADER BAR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
              {activeTab === 'overview' && 'Vue d\'ensemble du Portfolio'}
              {activeTab === 'projects' && 'Gestion des Projets'}
              {activeTab === 'skills' && 'Gestion des Compétences'}
              {activeTab === 'experiences' && 'Gestion du Parcours & Formations'}
              {activeTab === 'messages' && 'Boîte de Réception des Messages'}
              {activeTab === 'security' && 'Sécurité & Identifiants'}
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Base de données Neon PostgreSQL connectée • Mode Direct
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', textDecoration: 'none', background: 'rgba(37,99,235,0.15)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)', fontSize: '0.9rem' }}>
              <Globe size={16} /> Voir le site public
            </a>
            <button onClick={loadDashboardData} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={16} /> Actualiser
            </button>
          </div>
        </header>

        {/* ALERTS NOTIFICATION */}
        {alert && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: alert.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: alert.type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444',
            color: alert.type === 'success' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{alert.message}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Projets Réalisés</span>
                  <FolderGit2 size={20} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{projects.length}</div>
                <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Stockés sur Neon DB</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Compétences</span>
                  <Wrench size={20} color="#10b981" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{skills.length}</div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cataloguées</span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Messages Reçus</span>
                  <Mail size={20} color="#8b5cf6" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0' }}>{messages.length}</div>
                <span style={{ fontSize: '0.8rem', color: messages.filter(m => !m.read).length > 0 ? '#f59e0b' : '#94a3b8' }}>
                  {messages.filter(m => !m.read).length} non lus
                </span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Base de Données</span>
                  <Database size={20} color="#06b6d4" />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0.75rem 0', color: '#22c55e' }}>PostgreSQL Neon</div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pooler AWS us-east-2</span>
              </div>
            </div>

            {/* QUICK ACTIONS & RECENT ACTIVITY */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Actions Rapides</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTab('projects'); setShowProjectModal(true); }} style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Ajouter un Projet
                </button>
                <button onClick={() => { setActiveTab('skills'); setShowSkillModal(true); }} style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Ajouter une Compétence
                </button>
                <button onClick={() => setActiveTab('messages')} style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} /> Consulter les messages ({messages.filter(m => !m.read).length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Liste des Projets ({projects.length})</h3>
              <button onClick={() => { resetProjectForm(); setEditingProject(null); setShowProjectModal(true); }} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Nouveau Projet
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{proj.titleFr}</strong>
                      <span style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{proj.category}</span>
                      {proj.featured && <span style={{ background: 'rgba(234,179,8,0.2)', color: '#fde047', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>⭐ En vedette</span>}
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{proj.descFr}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditProject(proj)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#60a5fa', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteProject(proj.id)} style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PROJECT MODAL */}
            {showProjectModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style={{ marginTop: 0 }}>{editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</h3>
                  <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Slug unique</label>
                      <input type="text" value={projectForm.slug} onChange={e => setProjectForm({...projectForm, slug: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} placeholder="mon-projet" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Titre (FR)</label>
                        <input type="text" value={projectForm.titleFr} onChange={e => setProjectForm({...projectForm, titleFr: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Title (EN)</label>
                        <input type="text" value={projectForm.titleEn} onChange={e => setProjectForm({...projectForm, titleEn: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Description (FR)</label>
                      <textarea value={projectForm.descFr} onChange={e => setProjectForm({...projectForm, descFr: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', minHeight: '70px' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Description (EN)</label>
                      <textarea value={projectForm.descEn} onChange={e => setProjectForm({...projectForm, descEn: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', minHeight: '70px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Lien GitHub</label>
                        <input type="text" value={projectForm.githubUrl} onChange={e => setProjectForm({...projectForm, githubUrl: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} placeholder="https://github.com/..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Lien Démo</label>
                        <input type="text" value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} placeholder="https://..." />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} />
                        Mettre en vedette
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setShowProjectModal(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>
                        Annuler
                      </button>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: '#2563eb', border: 'none', color: '#fff', cursor: 'pointer' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Compétences ({skills.length})</h3>
              <button onClick={() => setShowSkillModal(true)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Ajouter une compétence
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1rem' }}>{sk.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>Catégorie: {sk.category} • Niveau: {sk.level}%</div>
                  </div>
                  <button onClick={() => handleDeleteSkill(sk.id)} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#f87171', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* SKILL MODAL */}
            {showSkillModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem', maxWidth: '400px', width: '100%' }}>
                  <h3 style={{ marginTop: 0 }}>Ajouter une compétence</h3>
                  <form onSubmit={handleSaveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Nom de la compétence</label>
                      <input type="text" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} placeholder="Ex: React Native" />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Catégorie</label>
                      <select value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend & DB</option>
                        <option value="mobile">Mobile</option>
                        <option value="tools_security">Cybersécurité & Outils</option>
                        <option value="fintech">Fintech & Paiement</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="button" onClick={() => setShowSkillModal(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>Annuler</button>
                      <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: '#2563eb', border: 'none', color: '#fff', cursor: 'pointer' }}>Enregistrer</button>
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
            <h3>Boîte de Réception des Messages ({messages.length})</h3>
            {messages.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Aucun message reçu pour le moment.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ background: msg.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(37, 99, 235, 0.1)', border: msg.read ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(37, 99, 235, 0.4)', padding: '1.25rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{msg.name}</strong> ({msg.email})
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(msg.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                    {msg.subject && <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '0.5rem' }}>Sujet: {msg.subject}</div>}
                    <p style={{ background: '#030712', padding: '0.75rem', borderRadius: '6px', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button onClick={() => handleMarkMessageRead(msg.id, !msg.read)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        {msg.read ? 'Marquer non lu' : 'Marquer comme lu'}
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
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
          <div style={{ maxWidth: '500px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Changer le mot de passe</h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mot de passe actuel</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Nouveau mot de passe</label>
                  <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Confirmer le nouveau mot de passe</label>
                  <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
                </div>

                <button type="submit" style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
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
