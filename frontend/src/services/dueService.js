import { api } from './api';

export const getMyDues = async () => {
    const res = await api.get('/dues/my');
    return res.data;
};

export const getAllDues = async () => {
    const res = await api.get('/dues');
    return res.data;
};

export const addDue = async (data) => {
    const res = await api.post('/dues', data);
    return res.data;
};
