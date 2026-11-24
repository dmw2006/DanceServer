// API Base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to get full image URLs
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api/')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
}

export function isImageAttachment(attachment) {
  return /^image\//.test(attachment.type || '') || /\.(jpe?g|png|gif|webp)$/i.test(attachment.url || '');
}

// A news post's attachments, including the single picture older posts stored in imageUrl
export function newsAttachments(item) {
  const legacy = item.imageUrl ? [{ url: item.imageUrl, name: '', type: 'image/*' }] : [];
  return [...legacy, ...(item.attachments || [])];
}

export function attachmentFileName(attachment) {
  return attachment.name || decodeURIComponent((attachment.url || '').split('/').pop() || 'download');
}

// Generic fetch wrapper with error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// API endpoints
export const api = {
  // Public endpoints
  getPrograms: () => apiRequest('/programs'),
  getSchedule: () => apiRequest('/schedule'),
  getGallery: () => apiRequest('/gallery'),
  getNews: () => apiRequest('/content'),
  getStaff: () => apiRequest('/staff'),
  getTestimonials: () => apiRequest('/testimonials'),
  getHighlights: () => apiRequest('/highlights'),
  getPageSettings: (page) => apiRequest(`/page-settings/${page}`),
  updatePageSettings: (page, data) => apiRequest(`/page-settings/${page}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getHeroSlides: () => apiRequest('/hero-slides'),
  createHeroSlide: (data) => apiRequest('/hero-slides', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHeroSlide: (id, data) => apiRequest(`/hero-slides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHeroSlide: (id) => apiRequest(`/hero-slides/${id}`, {
    method: 'DELETE',
  }),

  // Auth endpoints
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  // News (stored as content posts)
  createNews: (newsData) => apiRequest('/content', {
    method: 'POST',
    body: JSON.stringify(newsData),
  }),
  updateNews: (id, newsData) => apiRequest(`/content/${id}`, {
    method: 'PUT',
    body: JSON.stringify(newsData),
  }),
  deleteNews: (id) => apiRequest(`/content/${id}`, {
    method: 'DELETE',
  }),
  // New content management endpoints
  createHighlight: (data) => apiRequest('/highlights', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHighlight: (id, data) => apiRequest(`/highlights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHighlight: (id) => apiRequest(`/highlights/${id}`, {
    method: 'DELETE',
  }),
  
  createProgram: (data) => apiRequest('/programs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProgram: (id, data) => apiRequest(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProgram: (id) => apiRequest(`/programs/${id}`, {
    method: 'DELETE',
  }),
  
  createSchedule: (data) => apiRequest('/schedule', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSchedule: (id, data) => apiRequest(`/schedule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSchedule: (id) => apiRequest(`/schedule/${id}`, {
    method: 'DELETE',
  }),
  
  createTestimonial: (data) => apiRequest('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTestimonial: (id, data) => apiRequest(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTestimonial: (id) => apiRequest(`/testimonials/${id}`, {
    method: 'DELETE',
  }),
  
  createStaffMember: (data) => apiRequest('/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStaffMember: (id, data) => apiRequest(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteStaffMember: (id) => apiRequest(`/staff/${id}`, {
    method: 'DELETE',
  }),
  
  createGalleryItem: (data) => apiRequest('/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGalleryItem: (id, data) => apiRequest(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteGalleryItem: (id) => apiRequest(`/gallery/${id}`, {
    method: 'DELETE',
  }),
  
  // Upload endpoints
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }
    
    return await response.json();
  },
  
  uploadImages: async (files, token) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }
    
    return await response.json();
  },
  
  uploadFiles: async (files, token) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/upload/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return await response.json();
  },

  // User management endpoints
  getAllUsers: (token) => apiRequest('/auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  createUser: (data, token) => apiRequest('/auth/users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }),
  updateUser: (id, data, token) => apiRequest(`/auth/users/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }),
  deleteUser: (id, token) => apiRequest(`/auth/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),
  changePassword: (data, token) => apiRequest('/auth/change-password', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }),
};

export default api;
