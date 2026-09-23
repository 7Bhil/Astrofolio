import React, { useState } from 'react';
import { 
  User, Lock, LogOut, Mail, Globe, Github, Linkedin, 
  ShieldCheck, CheckCircle2, ExternalLink, Phone
} from 'lucide-react';
import { Input } from '../ui/FormGroup';
import { authApi } from '../../../services/api';

export default function ProfileTab({ onAlert, user, onLogout }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      if (onAlert) onAlert('danger', 'Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (formData.newPassword.length < 8) {
      if (onAlert) onAlert('danger', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.changePassword(formData.currentPassword, formData.newPassword);
      if (onAlert) onAlert('success', 'Mot de passe mis à jour avec succès !');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (onAlert) onAlert('danger', err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="pb-3 border-b border-white/10">
        <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
          <User size={18} className="text-cyan-400" />
          <span>Mon Profil</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Informations personnelles, liens et sécurité du compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte Profil */}
        <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl flex flex-col gap-5">
          {/* Avatar + Nom */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl font-black font-['Outfit'] shadow-lg shadow-blue-500/25 shrink-0">
              7B
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold font-['Outfit'] text-white">Bhilal CHITOU</h3>
              <p className="text-xs text-slate-400 mt-0.5">Développeur Full-Stack & Mobile</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Administrateur
              </span>
            </div>
          </div>

          {/* Infos de contact */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-xs">
              <Mail size={14} className="text-cyan-400 shrink-0" />
              <span className="text-slate-300 font-mono truncate">{user?.email || '7bhilal.chitou7@gmail.com'}</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Globe size={14} className="text-cyan-400 shrink-0" />
              <a href="https://7bhil.vercel.app" target="_blank" rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1 transition-colors">
                7bhil.vercel.app
                <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Github size={14} className="text-cyan-400 shrink-0" />
              <a href="https://github.com/7Bhil" target="_blank" rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1 transition-colors">
                github.com/7Bhil
                <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Linkedin size={14} className="text-cyan-400 shrink-0" />
              <a href="https://www.linkedin.com/in/bhilal-chitou/" target="_blank" rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1 transition-colors">
                linkedin.com/in/bhilal-chitou
                <ExternalLink size={11} />
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Phone size={14} className="text-cyan-400 shrink-0" />
              <a href="https://wa.me/2290144242964" target="_blank" rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 font-medium font-mono flex items-center gap-1 transition-colors">
                +229 01 44 24 29 64 (WhatsApp)
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Stack */}
          <div className="pt-4 border-t border-white/5">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">Stack principale</span>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'React Native', 'Tailwind CSS', 'Prisma', 'Astro', 'Docker'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 text-cyan-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bouton Déconnexion */}
          <button
            onClick={onLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut size={14} />
            <span>Se déconnecter</span>
          </button>
        </div>

        {/* Carte Sécurité — Changement de mot de passe */}
        <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <ShieldCheck size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold font-['Outfit'] text-white">Sécurité du compte</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <Input
              label="Mot de passe actuel *"
              type="password"
              required
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />

            <Input
              label="Nouveau mot de passe *"
              type="password"
              required
              placeholder="Minimum 8 caractères"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />

            <Input
              label="Confirmer le nouveau mot de passe *"
              type="password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              <span>{isSubmitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
