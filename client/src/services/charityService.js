import api from './api.js';

export const getAllCharities      = ()           => api.get('/charities');
export const getSingleCharity     = (id)         => api.get(`/charities/${id}`);
export const selectCharity        = (charity_id) => api.post('/charities/select', { charity_id });
export const updateContribution   = (percent)    => api.put('/charities/contribution', { charity_percent: percent });