import React from 'react';
import Modal from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/FormGroup';
import ImageUploadCloudinary from '../ui/ImageUploadCloudinary';

export default function ProjectModal({
  isOpen,
  onClose,
  editingProject,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) {
  const categoryOptions = [
    { value: 'web', label: 'Web & Fullstack' },
    { value: 'mobile', label: 'Application Mobile' },
    { value: 'fintech', label: 'Fintech & Paiement' },
    { value: 'tool', label: 'Outils & Compilateurs' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-1">
        <Input
          label="Slug unique *"
          required
          placeholder="ex: vitch-fintech"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          helperText="Identifiant technique unique pour l'URL du projet"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Titre (FR) *"
            required
            placeholder="Titre en français"
            value={formData.titleFr}
            onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
          />
          <Input
            label="Title (EN) *"
            required
            placeholder="Title in english"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Catégorie *"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Input
            label="Position d'affichage (Ordre)"
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            helperText="0 = premier projet affiché en tête"
          />
        </div>

        {/* CLOUDINARY IMAGE UPLOADER */}
        <ImageUploadCloudinary
          label="Image du projet (Cloudinary CDN)"
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
        />

        <Textarea
          label="Description courte (FR) *"
          required
          rows={2}
          value={formData.descFr}
          onChange={(e) => setFormData({ ...formData, descFr: e.target.value })}
        />

        <Textarea
          label="Description courte (EN) *"
          required
          rows={2}
          value={formData.descEn}
          onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Lien GitHub"
            type="url"
            placeholder="https://github.com/..."
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          />
          <Input
            label="Lien Démo Live"
            type="url"
            placeholder="https://..."
            value={formData.demoUrl || ''}
            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/20"
          />
          <label htmlFor="featured" className="text-xs font-semibold text-white select-none cursor-pointer">
            Mettre en avant sur la page d'accueil (Projet vedette ⭐)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
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
            {isSubmitting ? 'Enregistrement...' : (editingProject ? 'Mettre à jour' : 'Créer le projet')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
