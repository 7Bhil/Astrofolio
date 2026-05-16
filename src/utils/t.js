import { translations } from '../constants/translations';

export function getTranslations(lang) {
  return (path) => {
    const keys = path.split('.');
    let result = translations[lang] || translations['fr'];
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };
}
