import { useEffect, useState } from 'react';
import { getAllDues, addDue, updateDueStatus } from '../../services/dueService';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../services/api';

export const AdminDues = () => {
    const [dues, setDues] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ userId: '', amount: '', dueDate: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [duesData, residentsRes] = await Promise.all([
                getAllDues(),
                api.get('/admin/residents').catch(() => ({ data: [] })),
            ]);
            setDues(duesData);
            setResidents(residentsRes.data || []);
        } catch (err) {
            setError('Aidat verileri yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDue = async (e) => {
        e.preventDefault();
        if (!formData.userId || !formData.amount || !formData.dueDate) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await addDue({
                user_id: parseInt(formData.userId),
                amount: parseFloat(formData.amount),
                due_date: formData.dueDate,
            });
            setSuccess('Aidat başarıyla atandı.');
            setFormData({ userId: '', amount: '', dueDate: '' });
            setShowForm(false);
            const updatedDues = await getAllDues();
            setDues(updatedDues);
        } catch (err) {
            setError(err.response?.data?.detail || 'Aidat atanırken hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setError('');
        setSuccess('');
        try {
            await updateDueStatus(id, newStatus);
            setSuccess('Ödeme durumu güncellendi.');
            const updated = dues.map(d => d.id === id ? { ...d, status: newStatus } : d);
            setDues(updated);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Durum güncellenemedi.');
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Sakin', render: (row) => {
            const resident = residents.find(r => r.id === row.user_id);
            return resident ? `${resident.full_name}` : `Kullanıcı #${row.user_id}`;
        }},
        { header: 'Tutar', render: (row) => `${row.amount} TL` },
        { header: 'Son Ödeme', render: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString('tr-TR') : '-' },
        { header: 'Durum', render: (row) => (
            <select
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
                style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    backgroundColor: row.status === 'paid' ? '#dcfce7' : '#fee2e2',
                    color: row.status === 'paid' ? '#15803d' : '#b91c1c'
                }}
            >
                <option value="unpaid" style={{ backgroundColor: '#fff', color: '#000' }}>Ödenmedi</option>
                <option value="paid" style={{ backgroundColor: '#fff', color: '#000' }}>Ödendi</option>
            </select>
        )}
    ];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Aidat Yönetimi</h1>
                <Button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'İptal' : '+ Yeni Aidat Atama'}
                </Button>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

            {showForm && (
                <Card className="mb-6">
                    <h3 style={{ marginBottom: '1rem' }}>Sakin İçin Yeni Aidat Atama</h3>
                    <form onSubmit={handleCreateDue}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                    Site Sakini Seçin *
                                </label>
                                <select
                                    value={formData.userId}
                                    onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        backgroundColor: '#fff',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    <option value="">-- Sakin Seçin --</option>
                                    {residents.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.full_name} ({r.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Aidat Tutarı (TL) *" placeholder="Ör: 450" type="number" step="0.01"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                                <Input label="Son Ödeme Tarihi *" type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })} required />
                            </div>
                        </div>
                        <Button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Atanıyor...' : 'Aidat Ata'}
                        </Button>
                    </form>
                </Card>
            )}

            <Card>
                {dues.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz atanmış bir aidat bulunmuyor.
                    </p>
                ) : (
                    <Table columns={columns} data={dues} />
                )}
            </Card>
        </div>
    );
};
