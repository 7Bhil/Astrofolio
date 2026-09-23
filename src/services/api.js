const isLocalNetwork = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.') ||
  window.location.hostname.endsWith('.local')
);

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || (
  isLocalNetwork
    ? `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5005/api`
    : 'https://portfolio-server-frmx.onrender.com/api'
);

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

// Certifications API
export const certificationsApi = {
  getAll: () => apiRequest('/certifications'),
  create: (data) => apiRequest('/certifications', 'POST', data, true),
  update: (id, data) => apiRequest(`/certifications/${id}`, 'PUT', data, true),
  delete: (id) => apiRequest(`/certifications/${id}`, 'DELETE', null, true)
};

// Opportunities API (Opportunity Engine)
export const opportunitiesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/opportunities${query ? `?${query}` : ''}`, 'GET', null, true);
  },
  getById: (id) => apiRequest(`/opportunities/${id}`, 'GET', null, true),
  update: (id, data) => apiRequest(`/opportunities/${id}`, 'PATCH', data, true),
  updateMessage: (id, content) => apiRequest(`/opportunities/${id}/message`, 'PATCH', { content }, true),
  approve: (id) => apiRequest(`/opportunities/${id}/approve`, 'POST', null, true),
  reject: (id) => apiRequest(`/opportunities/${id}/reject`, 'POST', null, true),
  send: (id) => apiRequest(`/opportunities/${id}/send`, 'POST', null, true),
  reconcile: (id) => apiRequest(`/opportunities/${id}/reconcile`, 'POST', null, true),
  getLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/opportunities/system/logs${query ? `?${query}` : ''}`, 'GET', null, true);
  },
  getRuns: () => apiRequest('/opportunities/system/runs', 'GET', null, true),
  getSystemHealth: () => apiRequest('/opportunities/system/health', 'GET', null, true)
};


