import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { api } from '../../services/api';

export const AdminBuildings = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', blockCode: '', floorCount: '' });
    const [submitting, setSubmitting] = useState(false);

    // Apartment management state
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [apartments, setApartments] = useState([]);
    const [aptForm, setAptForm] = useState({ apartmentNumber: '', floor: '', aptType: '' });
    const [showAptForm, setShowAptForm] = useState(false);

    useEffect(() => { loadBuildings(); }, []);

    const loadBuildings = async () => {
        try {
            const res = await api.get('/admin/buildings');
            setBuildings(res.data);
        } catch {
            setError('Binalar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBuilding = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) { setError('Bina adı zorunludur'); return; }
        setSubmitting(true); setError(''); setSuccess('');
        try {
            await api.post('/admin/buildings', {
                name: formData.name,
                block_code: formData.blockCode || null,
                floor_count: formData.floorCount ? parseInt(formData.floorCount) : null,
            });
            setSuccess('Bina başarıyla oluşturuldu');
            setFormData({ name: '', blockCode: '', floorCount: '' });
            setShowForm(false);
            loadBuildings();
        } catch (err) {
            setError(err.response?.data?.detail || 'Bina oluşturulamadı');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBuilding = async (id) => {
        if (!confirm('Bu binayı silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/admin/buildings/${id}`);
            setSuccess('Bina silindi');
            loadBuildings();
            if (selectedBuilding?.id === id) { setSelectedBuilding(null); setApartments([]); }
        } catch (err) {
            setError(err.response?.data?.detail || 'Bina silinemedi');
        }
    };

    const handleSelectBuilding = async (building) => {
        setSelectedBuilding(building);
        try {
            const res = await api.get(`/admin/buildings/${building.id}/apartments`);
            setApartments(res.data);
        } catch { setApartments([]); }
    };

    const handleCreateApartment = async (e) => {
        e.preventDefault();
        if (!aptForm.apartmentNumber.trim()) { setError('Daire numarası zorunludur'); return; }
        setSubmitting(true); setError('');
        try {
            await api.post('/admin/apartments', {
                building_id: selectedBuilding.id,
                apartment_number: aptForm.apartmentNumber,
                floor: aptForm.floor ? parseInt(aptForm.floor) : null,
                apt_type: aptForm.aptType || null,
            });
            setSuccess('Daire oluşturuldu');
            setAptForm({ apartmentNumber: '', floor: '', aptType: '' });
            setShowAptForm(false);
            handleSelectBuilding(selectedBuilding);
        } catch (err) {
            setError(err.response?.data?.detail || 'Daire oluşturulamadı');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteApartment = async (id) => {
        if (!confirm('Bu daireyi silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/admin/apartments/${id}`);
            setSuccess('Daire silindi');
            handleSelectBuilding(selectedBuilding);
        } catch (err) {
            setError(err.response?.data?.detail || 'Daire silinemedi');
        }
    };

    const buildingColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Bina Adı', accessor: 'name' },
        { header: 'Blok Kodu', render: (r) => r.block_code || '-' },
        { header: 'Kat Sayısı', render: (r) => r.floor_count || '-' },
        {
            header: 'İşlemler', render: (r) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleSelectBuilding(r)}>
                        Daireler
                    </Button>
                    <Button className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleDeleteBuilding(r.id)}>
                        Sil
                    </Button>
                </div>
            ),
        },
    ];

    const aptColumns = [
        { header: 'Daire No', accessor: 'apartment_number' },
        { header: 'Kat', render: (r) => r.floor ?? '-' },
        { header: 'Tip', render: (r) => r.apt_type || '-' },
        {
            header: 'İşlem', render: (r) => (
                <Button className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => handleDeleteApartment(r.id)}>
                    Sil
                </Button>
            ),
        },
    ];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Bina / Blok Yönetimi</h1>
                <Button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'İptal' : '+ Yeni Bina'}
                </Button>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

            {/* Create Building Form */}
            {showForm && (
                <Card className="mb-6">
                    <h3 style={{ marginBottom: '1rem' }}>Yeni Bina Ekle</h3>
                    <form onSubmit={handleCreateBuilding}>
                        <div className="grid grid-cols-3 gap-4">
                            <Input label="Bina Adı *" value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <Input label="Blok Kodu" placeholder="Ör: A, B"
                                value={formData.blockCode}
                                onChange={e => setFormData({...formData, blockCode: e.target.value})} />
                            <Input label="Kat Sayısı" type="number"
                                value={formData.floorCount}
                                onChange={e => setFormData({...formData, floorCount: e.target.value})} />
                        </div>
                        <Button type="submit" className="btn-primary mt-4" disabled={submitting}>
                            {submitting ? 'Oluşturuluyor...' : 'Bina Oluştur'}
                        </Button>
                    </form>
                </Card>
            )}

            {/* Buildings Table */}
            <Card className="mb-6">
                {buildings.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz bina eklenmemiş. Yukarıdaki butonla yeni bina ekleyebilirsiniz.
                    </p>
                ) : (
                    <Table columns={buildingColumns} data={buildings} />
                )}
            </Card>

            {/* Apartment Section */}
            {selectedBuilding && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>📋 {selectedBuilding.name} — Daireler</h2>
                        <Button className="btn-primary" onClick={() => setShowAptForm(!showAptForm)}>
                            {showAptForm ? 'İptal' : '+ Daire Ekle'}
                        </Button>
                    </div>

                    {showAptForm && (
                        <Card className="mb-4">
                            <form onSubmit={handleCreateApartment}>
                                <div className="grid grid-cols-3 gap-4">
                                    <Input label="Daire No *" placeholder="Ör: 1, 2A"
                                        value={aptForm.apartmentNumber}
                                        onChange={e => setAptForm({...aptForm, apartmentNumber: e.target.value})} required />
                                    <Input label="Kat" type="number"
                                        value={aptForm.floor}
                                        onChange={e => setAptForm({...aptForm, floor: e.target.value})} />
                                    <Input label="Tip" placeholder="Ör: 3+1, 2+1"
                                        value={aptForm.aptType}
                                        onChange={e => setAptForm({...aptForm, aptType: e.target.value})} />
                                </div>
                                <Button type="submit" className="btn-primary mt-4" disabled={submitting}>
                                    {submitting ? 'Oluşturuluyor...' : 'Daire Ekle'}
                                </Button>
                            </form>
                        </Card>
                    )}

                    <Card>
                        {apartments.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                                Bu binada henüz daire eklenmemiş.
                            </p>
                        ) : (
                            <Table columns={aptColumns} data={apartments} />
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};
