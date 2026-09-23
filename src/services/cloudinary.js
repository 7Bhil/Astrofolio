/**
 * Service d'upload d'images vers Cloudinary
 */
const CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'digrefyfa';
const UPLOAD_PRESET = import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio';

/**
 * Upload un fichier image vers Cloudinary et retourne l'URL optimisée CDN
 * @param {File} file - Le fichier image sélectionné par l'utilisateur
 * @param {Function} [onProgress] - Callback optionnel pour suivre le pourcentage (0 à 100)
 * @returns {Promise<{ url: string, publicId: string, secureUrl: string }>}
 */
export async function uploadToCloudinary(file, onProgress = null) {
  if (!file) throw new Error('Aucun fichier fourni pour l\'upload.');
  
  // Validation taille max 10 Mo
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Le fichier est trop lourd. La taille maximale est de 10 Mo.');
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'portfolio/images');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          // Utilise https et applique f_auto,q_auto pour compression max
          const optimizedUrl = data.secure_url.replace(
            '/upload/',
            '/upload/f_auto,q_auto/'
          );
          resolve({
            url: optimizedUrl,
            secureUrl: data.secure_url,
            publicId: data.public_id
          });
        } else {
          const errorMsg = data.error?.message || 'Erreur lors de l\'upload Cloudinary';
          reject(new Error(errorMsg));
        }
      } catch (err) {
        reject(new Error('Réponse Cloudinary invalide'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Échec de la connexion réseau vers Cloudinary'));
    };

    xhr.send(formData);
  });
}
