import { api } from './api';

export const getDashboardInsights = async () => {
    const res = await api.get('/ai/dashboard-insights');
    return res.data;
};
