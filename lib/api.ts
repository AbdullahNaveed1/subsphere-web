import axios from 'axios';

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL + '/api' });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('orgId');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    if (orgId) config.headers['X-Org-Id'] = orgId;
  }
  return config;
});

export function setAuth(token: string, orgId?: string) {
  localStorage.setItem('token', token);
  if (orgId) localStorage.setItem('orgId', orgId);
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('orgId');
}
