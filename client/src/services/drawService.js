import api from './api.js';

export const getAllDraws      = ()   => api.get('/draws');
export const getSingleDraw    = (id) => api.get(`/draws/${id}`);
export const getUserDrawResult = (id) => api.get(`/draws/${id}/result`);