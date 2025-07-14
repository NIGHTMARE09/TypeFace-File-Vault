import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const register = (email: string, password: string, name?: string) => api.post('/auth/register', { email, password, name });

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFiles = () => api.get('/files');
export const downloadFile = (fileId: string) => api.get(`/files/${fileId}`, { responseType: 'blob' });
export const deleteFile = (fileId: string) => api.delete(`/files/${fileId}`);

export default api;
