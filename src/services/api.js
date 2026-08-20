const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5005/api'
  : 'https://portfolio-backend-7bhil.onrender.com/api'; // Or relative/Vercel URL

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('7bhil_admin_token');
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('7bhil_admin_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('7bhil_admin_token');
  }
}

export async function apiRequest(endpoint, method = 'GET', body = null, requireAuth = false) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la requête');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  login: (email, password) => apiRequest('/auth/login', 'POST', { email, password }),
  getMe: () => apiRequest('/auth/me', 'GET', null, true),
  changePassword: (currentPassword, newPassword) => apiRequest('/auth/password', 'PUT', { currentPassword, newPassword }, true)
};

// Projects API
export const projectsApi = {
  getAll: () => apiRequest('/projects'),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (data) => apiRequest('/projects', 'POST', data, true),
  update: (id, data) => apiRequest(`/projects/${id}`, 'PUT', data, true),
  reorder: (items) => apiRequest('/projects/reorder', 'PUT', { items }, true),
  delete: (id) => apiRequest(`/projects/${id}`, 'DELETE', null, true)
};

// Skills API
export const skillsApi = {
  getAll: () => apiRequest('/skills'),
  create: (data) => apiRequest('/skills', 'POST', data, true),
  update: (id, data) => apiRequest(`/skills/${id}`, 'PUT', data, true),
  delete: (id) => apiRequest(`/skills/${id}`, 'DELETE', null, true)
};

// Experiences API
export const experiencesApi = {
  getAll: () => apiRequest('/experiences'),
  create: (data) => apiRequest('/experiences', 'POST', data, true),
  update: (id, data) => apiRequest(`/experiences/${id}`, 'PUT', data, true),
  delete: (id) => apiRequest(`/experiences/${id}`, 'DELETE', null, true)
};

// Messages API
export const messagesApi = {
  send: (data) => apiRequest('/messages', 'POST', data),
  getAll: () => apiRequest('/messages', 'GET', null, true),
  markRead: (id, read = true) => apiRequest(`/messages/${id}/read`, 'PATCH', { read }, true),
  delete: (id) => apiRequest(`/messages/${id}`, 'DELETE', null, true)
};

// Stats API
export const statsApi = {
  getStats: () => apiRequest('/stats', 'GET', null, true)
};
