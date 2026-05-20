import { api } from './api';

export const getComplaints = async () => {
    const res = await api.get('/complaints');
    return res.data;
};

export const getMyComplaints = async () => {
    const res = await api.get('/complaints/my');
    return res.data;
};

export const createComplaint = async (data) => {
    const res = await api.post('/complaints', data);
    return res.data;
};

export const updateComplaintStatus = async (id, status) => {
    const res = await api.put(`/complaints/${id}/status`, { status });
    return res.data;
};
