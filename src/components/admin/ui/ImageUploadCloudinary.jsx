import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../../../services/cloudinary';

export default function ImageUploadCloudinary({ value, onChange, label = "Image (Cloudinary CDN)" }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const res = await uploadToCloudinary(file, (percent) => {
        setProgress(percent);
      });
      onChange(res.url);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléversement vers Cloudinary');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-xs font-semibold text-slate-300">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all">
          {isUploading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Téléversement ({progress}%)...</span>
            </>
          ) : (
            <>
              <Upload size={15} />
              <span>Uploader vers Cloudinary</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        <span className="text-xs text-slate-500">ou saisissez l'URL :</span>
      </div>

      {isUploading && (
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        type="text"
        placeholder="https://res.cloudinary.com/... ou chemin relatif"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="mt-2 flex items-center justify-between p-2 bg-slate-950/60 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={value} 
              alt="Aperçu" 
              className="w-14 h-10 object-cover rounded-lg border border-white/10"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Image prête
              </span>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                {value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
          >
            Retirer
          </button>
        </div>
      )}
    </div>
  );
}
