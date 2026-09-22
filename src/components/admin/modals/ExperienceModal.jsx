import React from 'react';
import Modal from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/FormGroup';

export default function ExperienceModal({
  isOpen,
  onClose,
  editingExp,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) {
  const typeOptions = [
    { value: 'experience', label: 'Expérience Professionnelle' },
    { value: 'education', label: 'Formation / Diplôme' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExp ? 'Modifier le parcours' : 'Ajouter un parcours'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-1">
        <Select
          label="Type d'entrée *"
          options={typeOptions}
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Rôle / Titre (FR) *"
            required
            placeholder="ex: Ingénieur Fullstack"
            value={formData.roleFr}
            onChange={(e) => setFormData({ ...formData, roleFr: e.target.value })}
          />
          <Input
            label="Role / Title (EN) *"
            required
            placeholder="ex: Fullstack Engineer"
            value={formData.roleEn}
            onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Entreprise / École (FR) *"
            required
            placeholder="ex: Entreprise X ou IUT"
            value={formData.companyFr}
            onChange={(e) => setFormData({ ...formData, companyFr: e.target.value })}
          />
          <Input
            label="Company / School (EN) *"
            required
            placeholder="ex: Company X or University"
            value={formData.companyEn}
            onChange={(e) => setFormData({ ...formData, companyEn: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Période (FR) *"
            required
            placeholder="ex: 2023 — Présent"
            value={formData.dateFr}
            onChange={(e) => setFormData({ ...formData, dateFr: e.target.value })}
          />
          <Input
            label="Period (EN) *"
            required
            placeholder="ex: 2023 — Present"
            value={formData.dateEn}
            onChange={(e) => setFormData({ ...formData, dateEn: e.target.value })}
          />
        </div>

        <Textarea
          label="Description (FR)"
          rows={2}
          value={formData.descFr || ''}
          onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
        />

        <Textarea
          label="Description (EN)"
          rows={2}
          value={formData.descEn || ''}
          onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
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
            {isSubmitting ? 'Enregistrement...' : (editingExp ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
