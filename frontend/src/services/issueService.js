import api from './api';

export const getIssues = () => api.get('/issues');
export const issueAsset = (data) => api.post('/issues', data);
export const getIssuedForReturn = () => api.get('/returns');
export const returnAsset = (issueId, data) => api.put(`/returns/${issueId}`, data);
