import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const vehiclesApi = {
  getAll:      params  => api.get('/vehicles', { params }),
  getOne:      id      => api.get(`/vehicles/${id}`),
  adminGetAll: params  => api.get('/admin/vehicles', { params }),
  create:      data    => api.post('/admin/vehicles', data),
  update:      (id, d) => api.put(`/admin/vehicles/${id}`, d),
  markSold:    (id, d) => api.patch(`/admin/vehicles/${id}/sold`, d),
  delete:      id      => api.delete(`/admin/vehicles/${id}`),
};

export const articlesApi = {
  getAll:      params  => api.get('/articles', { params }),
  getOne:      slug    => api.get(`/articles/${slug}`),
  adminGetAll: params  => api.get('/admin/articles', { params }),
  create:      data    => api.post('/admin/articles', data),
  update:      (id, d) => api.put(`/admin/articles/${id}`, d),
  delete:      id      => api.delete(`/admin/articles/${id}`),
};

export const videosApi = {
  getAll:      params  => api.get('/videos', { params }),
  adminGetAll: ()      => api.get('/admin/videos'),
  create:      data    => api.post('/admin/videos', data),
  update:      (id, d) => api.put(`/admin/videos/${id}`, d),
  delete:      id      => api.delete(`/admin/videos/${id}`),
};

export const leadsApi = {
  create:       data    => api.post('/leads', data),
  getAll:       params  => api.get('/admin/leads', { params }),
  updateStatus: (id, d) => api.patch(`/admin/leads/${id}`, d),
};

export const authApi = {
  login:  data => api.post('/auth/login', data),
  me:     ()   => api.get('/auth/me'),
  logout: ()   => api.post('/auth/logout'),
  changePassword: data => api.put('/auth/change-password', data),
};

export const miscApi = {
  getBrands:        ()     => api.get('/brands'),
  adminGetBrands:   ()     => api.get('/admin/brands'),
  adminCreateBrand: (name) => api.post('/admin/brands', { name }),
  getDashboard:     ()     => api.get('/admin/dashboard'),
};

export default api;
