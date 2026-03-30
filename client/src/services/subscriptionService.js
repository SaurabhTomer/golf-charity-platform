import api from './api.js';

export const createOrder  = (plan) => api.post('/subscriptions/create-order', { plan });
export const verifyPayment = (data) => api.post('/subscriptions/verify-payment', data);
export const getStatus    = ()     => api.get('/subscriptions/status');
export const cancelSub    = ()     => api.post('/subscriptions/cancel');