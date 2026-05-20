import { api } from './api';

export const getAnnouncements = async () => {
    const res = await api.get('/announcements');
    return res.data;
};

export const createAnnouncement = async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
};
