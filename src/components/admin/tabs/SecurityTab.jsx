import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../ui/FormGroup';
import { authApi } from '../../../services/api';

export default function SecurityTab({ onAlert }) {
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
    <div className="w-full max-w-xl">
      <div className="pb-3 border-b border-white/10 mb-5">
        <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-400" />
          <span>Sécurité & Accès</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Modifiez vos identifiants d'accès au tableau de bord
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
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
  );
}
