import { api } from './api';

export const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.access_token;
    localStorage.setItem('token', token);

    const meRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    const user = {
        id: meRes.data.id,
        name: meRes.data.full_name,
        email: meRes.data.email,
        role: meRes.data.role,
        site_id: meRes.data.site_id,
        building_id: meRes.data.building_id,
        apartment_id: meRes.data.apartment_id,
    };
    return { token, user };
};

export const register = async (userData) => {
    const payload = {
        register_type: userData.registerType || "resident",
        full_name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null,
    };

    if (payload.register_type === "resident") {
        payload.site_code = userData.siteCode || null;
        payload.building_id = userData.buildingId ? parseInt(userData.buildingId) : null;
        payload.apartment_id = userData.apartmentId ? parseInt(userData.apartmentId) : null;
    } else {
        payload.site_name = userData.siteName || null;
        payload.city = userData.city || null;
        payload.address = userData.address || null;
    }

    const res = await api.post('/auth/register', payload);
    return res.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
