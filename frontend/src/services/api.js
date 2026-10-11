export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// In-memory token storage (per persistent constraints: NO localStorage)
let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token;
};

export const getAuthToken = () => {
  return memoryToken;
};

export const clearAuthToken = () => {
  memoryToken = null;
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Products
  getProducts: (page = 0, size = 20, category = '', search = '') => {
    const params = new URLSearchParams({ page, size });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return request(`/api/products?${params.toString()}`);
  },

  getProductById: (id) => request(`/api/products/${id}`),

  deleteAllProducts: () => request('/api/products', { method: 'DELETE' }),

  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  bulkUpload: (formData) => request('/api/products/bulk-upload', {
    method: 'POST',
    body: formData,
  }),

  // Images
  uploadImages: (productId, formData) => request(`/api/products/${productId}/images`, {
    method: 'POST',
    body: formData,
  }),

  // Channel Fields & Validation
  upsertChannelFields: (productId, channel, fieldsMap) => request(`/api/products/${productId}/channel-fields/${channel}`, {
    method: 'POST',
    body: JSON.stringify(fieldsMap),
  }),

  validateListing: (productId, channel) => request(`/api/products/${productId}/validate/${channel}`),

  // Async Publish & Polling
  publishProducts: (channel, productIds) => request(`/api/products/publish/${channel}`, {
    method: 'POST',
    body: JSON.stringify({ productIds }),
  }),

  retryPublish: (productId, channel) => request(`/api/products/${productId}/channels/${channel}/retry-publish`, {
    method: 'POST',
  }),

  getPublishStatus: (batchId) => request(`/api/products/publish-status/${batchId}`),

  // Multi-Channel Sync Status
  getChannelSyncStatus: (productId) => request(`/api/products/${productId}/channel-sync-status`),

  // Mock Channel Status Setting
  setMockChannelStatus: (productId, channel) => request(`/api/products/${productId}/publish-mock/${channel}`, {
    method: 'POST',
  }),

  // Flipkart Marketplace Status & Connection Test
  getFlipkartStatus: () => request('/api/marketplaces/flipkart/status'),
  testFlipkartConnection: () => request('/api/marketplaces/flipkart/test', { method: 'POST' }),
};
