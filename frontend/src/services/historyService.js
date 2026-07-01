import api from './api';

export const getHistory = (params) => api.get('/history', { params });
export const getDashboard = () => api.get('/dashboard');
