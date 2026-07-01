import api from './api';

export const getAssets = () => api.get('/assets');
export const getAsset = (id) => api.get(`/assets/${id}`);
export const createAsset = (data) => api.post('/assets', data);
export const updateAsset = (id, data) => api.put(`/assets/${id}`, data);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);
export const scrapAsset = (id, data) => api.put(`/assets/${id}/scrap`, data);
export const getStock = () => api.get('/assets/stock');
