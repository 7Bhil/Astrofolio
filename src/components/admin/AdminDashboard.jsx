import React, { useState, useEffect } from 'react';
import { 
  authApi, 
  projectsApi, 
  skillsApi, 
  experiencesApi, 
  certificationsApi,
  messagesApi, 
  getAuthToken,
  removeAuthToken 
} from '../../services/api';

// Layout
import AdminSidebar from './layout/AdminSidebar';
import AdminMobileHeader from './layout/AdminMobileHeader';
import AdminBottomNav from './layout/AdminBottomNav';
import AdminAlert from './layout/AdminAlert';

// Tabs
import OverviewTab from './tabs/OverviewTab';
import ProjectsTab from './tabs/ProjectsTab';
import SkillsTab from './tabs/SkillsTab';
import ExperiencesTab from './tabs/ExperiencesTab';
import CertificationsTab from './tabs/CertificationsTab';
import MessagesTab from './tabs/MessagesTab';
import OpportunitiesTab from './tabs/OpportunitiesTab';
import ProspectsCRM from './ProspectsCRM';
import SecurityTab from './tabs/SecurityTab';

// Modals
import ProjectModal from './modals/ProjectModal';
import SkillModal from './modals/SkillModal';
import ExperienceModal from './modals/ExperienceModal';
import CertificationModal from './modals/CertificationModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [alert, setAlert] = useState(null);

  // Entities state
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modals & Forms State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    slug: '', titleFr: '', titleEn: '', descFr: '', descEn: '', category: 'web', image: '', githubUrl: '', demoUrl: '', featured: true, order: 0
  });

  // Skill Modal
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', category: 'frontend', level: 90 });

  // Experience Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({
    type: 'experience', roleFr: '', roleEn: '', companyFr: '', companyEn: '', dateFr: '', dateEn: '', descFr: '', descEn: '', order: 0
  });

  // Certification Modal
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '', order: 0
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/admin';
  };

  // Initial Auth & Data Load
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = getAuthToken();
    if (!token) {
      window.location.replace('/admin');
      return;
    }

    setIsSyncing(true);
    try {
      const [userData, dashData] = await Promise.all([
        authApi.getMe(),
        Promise.all([
          projectsApi.getAll().catch(() => []),
          skillsApi.getAll().catch(() => []),
          experiencesApi.getAll().catch(() => []),
          certificationsApi.getAll().catch(() => []),
          messagesApi.getAll().catch(() => [])
        ])
      ]);

      if (userData && userData.user) {
        setUser(userData.user);
        const [projRes, skillRes, expRes, certRes, msgRes] = dashData;
        if (Array.isArray(projRes)) setProjects(projRes);
        if (Array.isArray(skillRes)) setSkills(skillRes);
        if (Array.isArray(expRes)) setExperiences(expRes);
        if (Array.isArray(certRes)) setCertifications(certRes);
        if (Array.isArray(msgRes)) setMessages(msgRes);
      } else {
        removeAuthToken();
        window.location.replace('/admin');
      }
    } catch (err) {
      console.error("Auth error:", err);
      const isAuthIssue = err.message && (
        err.message.includes('non autorisé') || 
        err.message.includes('Jeton') || 
        err.message.includes('invalide') || 
        err.message.includes('expiré')
      );

      if (isAuthIssue) {
        removeAuthToken();
        window.location.replace('/admin');
      } else {
        showAlert('danger', err.message || 'Impossible de synchroniser avec le serveur.');
      }
    } finally {
      setIsSyncing(false);
      setInitialLoaded(true);
    }
  };

  const refreshData = async () => {
    setIsSyncing(true);
    try {
      const [projRes, skillRes, expRes, certRes, msgRes] = await Promise.all([
        projectsApi.getAll().catch(() => []),
        skillsApi.getAll().catch(() => []),
        experiencesApi.getAll().catch(() => []),
        certificationsApi.getAll().catch(() => []),
        messagesApi.getAll().catch(() => [])
      ]);

      if (Array.isArray(projRes)) setProjects(projRes);
      if (Array.isArray(skillRes)) setSkills(skillRes);
      if (Array.isArray(expRes)) setExperiences(expRes);
      if (Array.isArray(certRes)) setCertifications(certRes);
      if (Array.isArray(msgRes)) setMessages(msgRes);
      showAlert('success', 'Données actualisées !');
    } catch (err) {
      showAlert('danger', 'Erreur lors de l\'actualisation.');
    } finally {
      setIsSyncing(false);
    }
  };

  // --- PROJECT CRUD HANDLERS ---
  const handleOpenProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        slug: proj.slug || '',
        titleFr: proj.titleFr || '',
        titleEn: proj.titleEn || '',
        descFr: proj.descFr || '',
        descEn: proj.descEn || '',
        category: proj.category || 'web',
        image: proj.image || '',
        githubUrl: proj.githubUrl || '',
        demoUrl: proj.demoUrl || '',
        featured: proj.featured !== undefined ? proj.featured : true,
        order: proj.order !== undefined ? proj.order : 0
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        slug: '', titleFr: '', titleEn: '', descFr: '', descEn: '', category: 'web', image: '', githubUrl: '', demoUrl: '', featured: true, order: projects.length
      });
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const updated = await projectsApi.update(editingProject.id, projectForm);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...projectForm, ...updated } : p));
        showAlert('success', 'Projet mis à jour avec succès !');
      } else {
        const created = await projectsApi.create(projectForm);
        setProjects(prev => [...prev, created || { ...projectForm, id: Date.now().toString() }]);
        showAlert('success', 'Nouveau projet créé !');
      }
      setShowProjectModal(false);
      setEditingProject(null);
    } catch (err) {
      showAlert('danger', err.message || 'Erreur lors de l\'enregistrement du projet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      setProjects(prev => prev.filter(p => p.id !== id));
      await projectsApi.delete(id);
      showAlert('success', 'Projet supprimé !');
    } catch (err) {
      showAlert('danger', 'Erreur lors de la suppression.');
      refreshData();
    }
  };

  const handleReorderProjects = async (reordered) => {
    setProjects(reordered);
    try {
      await projectsApi.reorder(reordered.map(p => ({ id: p.id, order: p.order })));
      showAlert('success', 'Ordre des projets réorganisé !');
    } catch (err) {
      showAlert('danger', 'Erreur de réorganisation.');
      refreshData();
    }
  };

  // --- SKILL CRUD HANDLERS ---
  const handleOpenSkillModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({ name: skill.name, category: skill.category, level: skill.level || 90 });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: '', category: 'frontend', level: 90 });
    }
    setShowSkillModal(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSkill) {
        const updated = await skillsApi.update(editingSkill.id, skillForm);
        setSkills(prev => prev.map(s => s.id === editingSkill.id ? { ...s, ...skillForm, ...updated } : s));
        showAlert('success', 'Compétence mise à jour !');
      } else {
        const created = await skillsApi.create(skillForm);
        setSkills(prev => [...prev, created || { ...skillForm, id: Date.now().toString() }]);
        showAlert('success', 'Compétence ajoutée !');
      }
      setShowSkillModal(false);
      setEditingSkill(null);
    } catch (err) {
      showAlert('danger', 'Erreur d\'enregistrement de la compétence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;
    try {
      setSkills(prev => prev.filter(s => s.id !== id));
      await skillsApi.delete(id);
      showAlert('success', 'Compétence supprimée.');
    } catch (err) {
      showAlert('danger', 'Erreur de suppression.');
      refreshData();
    }
  };

  // --- EXPERIENCE CRUD HANDLERS ---
  const handleOpenExpModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm({
        type: exp.type || 'experience',
        roleFr: exp.roleFr || '', roleEn: exp.roleEn || '',
        companyFr: exp.companyFr || '', companyEn: exp.companyEn || '',
        dateFr: exp.dateFr || '', dateEn: exp.dateEn || '',
        descFr: exp.descFr || '', descEn: exp.descEn || '',
        order: exp.order || 0
      });
    } else {
      setEditingExp(null);
      setExpForm({
        type: 'experience', roleFr: '', roleEn: '', companyFr: '', companyEn: '', dateFr: '', dateEn: '', descFr: '', descEn: '', order: 0
      });
    }
    setShowExpModal(true);
  };

  const handleSaveExp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingExp) {
        const updated = await experiencesApi.update(editingExp.id, expForm);
        setExperiences(prev => prev.map(exp => exp.id === editingExp.id ? { ...exp, ...expForm, ...updated } : exp));
        showAlert('success', 'Parcours mis à jour !');
      } else {
        const created = await experiencesApi.create(expForm);
        setExperiences(prev => [...prev, created || { ...expForm, id: Date.now().toString() }]);
        showAlert('success', 'Nouvelle entrée ajoutée !');
      }
      setShowExpModal(false);
      setEditingExp(null);
    } catch (err) {
      showAlert('danger', 'Erreur d\'enregistrement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Supprimer cette entrée ?')) return;
    try {
      setExperiences(prev => prev.filter(e => e.id !== id));
      await experiencesApi.delete(id);
      showAlert('success', 'Entrée supprimée.');
    } catch (err) {
      showAlert('danger', 'Erreur de suppression.');
      refreshData();
    }
  };

  // --- CERTIFICATION CRUD HANDLERS ---
  const handleOpenCertModal = (cert = null) => {
    if (cert) {
      setEditingCert(cert);
      setCertForm({
        title: cert.title || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        credentialUrl: cert.credentialUrl || '',
        imageUrl: cert.imageUrl || '',
        order: cert.order || 0
      });
    } else {
      setEditingCert(null);
      setCertForm({
        title: '', issuer: '', date: '', credentialUrl: '', imageUrl: '', order: certifications.length
      });
    }
    setShowCertModal(true);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCert) {
        const updated = await certificationsApi.update(editingCert.id, certForm);
        setCertifications(prev => prev.map(c => c.id === editingCert.id ? { ...c, ...certForm, ...updated } : c));
        showAlert('success', 'Certification mise à jour !');
      } else {
        const created = await certificationsApi.create(certForm);
        setCertifications(prev => [...prev, created || { ...certForm, id: Date.now().toString() }]);
        showAlert('success', 'Certification ajoutée !');
      }
      setShowCertModal(false);
      setEditingCert(null);
    } catch (err) {
      showAlert('danger', 'Erreur d\'enregistrement de la certification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Supprimer cette certification ?')) return;
    try {
      setCertifications(prev => prev.filter(c => c.id !== id));
      await certificationsApi.delete(id);
      showAlert('success', 'Certification supprimée.');
    } catch (err) {
      showAlert('danger', 'Erreur de suppression.');
      refreshData();
    }
  };

  // --- MESSAGE HANDLERS ---
  const handleMarkMessageRead = async (id, read) => {
    try {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
      await messagesApi.markRead(id, read);
    } catch (err) {
      showAlert('danger', 'Erreur lors de la mise à jour.');
      refreshData();
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      setMessages(prev => prev.filter(m => m.id !== id));
      await messagesApi.delete(id);
      showAlert('success', 'Message supprimé.');
    } catch (err) {
      showAlert('danger', 'Erreur de suppression.');
      refreshData();
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sidebar Desktop */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        counts={{
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          certifications: certifications.length,
          unreadMessages: unreadCount,
          prospects: 34
        }}
        onLogout={handleLogout}
      />

      {/* Mobile Top Header */}
      <AdminMobileHeader
        onRefresh={refreshData}
        isSyncing={isSyncing}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Notification Banner */}
        <AdminAlert alert={alert} />

        {/* Tab Router */}
        {activeTab === 'overview' && (
          <OverviewTab
            projects={projects}
            skills={skills}
            messages={messages}
            experiences={experiences}
            certifications={certifications}
            initialLoaded={initialLoaded}
            setActiveTab={setActiveTab}
            onOpenProjectModal={() => handleOpenProjectModal()}
            onOpenSkillModal={() => handleOpenSkillModal()}
            onOpenCertModal={() => handleOpenCertModal()}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            onOpenModal={() => handleOpenProjectModal()}
            onEditProject={handleOpenProjectModal}
            onDeleteProject={handleDeleteProject}
            onReorderProjects={handleReorderProjects}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsTab
            skills={skills}
            onOpenModal={() => handleOpenSkillModal()}
            onEditSkill={handleOpenSkillModal}
            onDeleteSkill={handleDeleteSkill}
          />
        )}

        {activeTab === 'experiences' && (
          <ExperiencesTab
            experiences={experiences}
            onOpenModal={() => handleOpenExpModal()}
            onEditExp={handleOpenExpModal}
            onDeleteExp={handleDeleteExp}
          />
        )}

        {activeTab === 'certifications' && (
          <CertificationsTab
            certifications={certifications}
            onOpenModal={() => handleOpenCertModal()}
            onEditCert={handleOpenCertModal}
            onDeleteCert={handleDeleteCert}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesTab
            messages={messages}
            onMarkRead={handleMarkMessageRead}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesTab onAlert={showAlert} />
        )}

        {activeTab === 'prospects' && (
          <ProspectsCRM />
        )}

        {activeTab === 'security' && (
          <SecurityTab onAlert={showAlert} />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <AdminBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
      />

      {/* MODALS */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        editingProject={editingProject}
        formData={projectForm}
        setFormData={setProjectForm}
        onSubmit={handleSaveProject}
        isSubmitting={isSubmitting}
      />

      <SkillModal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        editingSkill={editingSkill}
        formData={skillForm}
        setFormData={setSkillForm}
        onSubmit={handleSaveSkill}
        isSubmitting={isSubmitting}
      />

      <ExperienceModal
        isOpen={showExpModal}
        onClose={() => setShowExpModal(false)}
        editingExp={editingExp}
        formData={expForm}
        setFormData={setExpForm}
        onSubmit={handleSaveExp}
        isSubmitting={isSubmitting}
      />

      <CertificationModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        editingCert={editingCert}
        formData={certForm}
        setFormData={setCertForm}
        onSubmit={handleSaveCert}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
