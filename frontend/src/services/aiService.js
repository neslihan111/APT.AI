import { api } from './api';

export const getDashboardInsights = async () => {
    const res = await api.get('/ai/dashboard-insights');
    return res.data;
};

export const sendAssistantMessage = async (message) => {
    const res = await api.post('/ai/assistant', { message });
    return res.data;
};
