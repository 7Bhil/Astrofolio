import React from 'react';
import Modal from '../ui/Modal';
import { Input } from '../ui/FormGroup';
import ImageUploadCloudinary from '../ui/ImageUploadCloudinary';

export default function CertificationModal({
  isOpen,
  onClose,
  editingCert,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCert ? 'Modifier la certification' : 'Ajouter une certification'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-1">
        <Input
          label="Titre de la certification *"
          required
          placeholder="ex: Meta Certified Front-End Developer"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Organisme émetteur *"
            required
            placeholder="ex: Coursera / Meta / Google"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          />

          <Input
            label="Date d'obtention *"
            required
            placeholder="ex: Mai 2024"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <Input
          label="Lien de vérification (Credential URL)"
          type="url"
          placeholder="https://coursera.org/verify/..."
          value={formData.credentialUrl || ''}
          onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
        />

        {/* IMAGE UPLOAD WIDGET */}
        <ImageUploadCloudinary
          label="Badge / Image du certificat (Cloudinary)"
          value={formData.imageUrl || ''}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        />

        <Input
          label="Ordre d'affichage"
          type="number"
          min="0"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
            {isSubmitting ? 'Enregistrement...' : (editingCert ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
