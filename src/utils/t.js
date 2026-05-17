import { translations } from '../constants/translations';

export function getTranslations(lang) {
  const currentTranslations = translations[lang] || translations['fr'];
  
  // Return an object that can be accessed by both function call and property access
  const t = (path) => {
    const keys = path.split('.');
    let result = currentTranslations;
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  // Add direct properties for React components that might use t['key']
  // This is a bit of a hack to support both styles without refactoring everything
  const flatten = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        Object.assign(acc, flatten(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const flatTranslations = flatten(currentTranslations);
  Object.assign(t, flatTranslations);

  return t;
}
