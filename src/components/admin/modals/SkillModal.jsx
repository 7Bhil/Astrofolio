import React from 'react';
import Modal from '../ui/Modal';
import { Input, Select } from '../ui/FormGroup';

export default function SkillModal({
  isOpen,
  onClose,
  editingSkill,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) {
  const categoryOptions = [
    { value: 'frontend', label: 'Frontend & UI' },
    { value: 'backend', label: 'Backend & Bases de données' },
    { value: 'mobile', label: 'Mobile (React Native)' },
    { value: 'fintech', label: 'Fintech & Paiement' },
    { value: 'tools_security', label: 'Cybersécurité & Outils' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSkill ? 'Modifier la compétence' : 'Ajouter une compétence'}
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-1">
        <Input
          label="Nom de la compétence *"
          required
          placeholder="ex: React Native / TypeScript"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Select
          label="Catégorie *"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />

        <Input
          label="Niveau de maîtrise (% de 1 à 100) *"
          type="number"
          min="10"
          max="100"
          required
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 90 })}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : (editingSkill ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
