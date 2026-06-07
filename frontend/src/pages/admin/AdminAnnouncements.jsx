import { useEffect, useState } from 'react';
import { getAnnouncements, createAnnouncement } from '../../services/announcementService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch {
            setError('Duyurular yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await createAnnouncement(formData);
            setSuccess('Duyuru başarıyla eklendi ve AI özeti oluşturuldu!');
            setFormData({ title: '', content: '' });
            setShowForm(false);
            loadAnnouncements();
        } catch (err) {
            setError(err.response?.data?.detail || 'Duyuru eklenirken bir hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Duyuru Yönetimi</h1>
                <Button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'İptal' : '+ Yeni Duyuru'}
                </Button>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

            {showForm && (
                <Card className="mb-6">
                    <h3 style={{ marginBottom: '1rem' }}>Yeni Duyuru Oluştur</h3>
                    <form onSubmit={handleSubmit}>
                        <Input label="Başlık *" placeholder="Duyuru başlığını girin"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <Textarea label="Duyuru İçeriği *" placeholder="Duyuru detaylarını buraya yazın..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                        <Button type="submit" className="btn-primary mt-4" disabled={submitting}>
                            {submitting ? 'Gönderiliyor...' : 'Yayınla'}
                        </Button>
                    </form>
                </Card>
            )}

            {announcements.length === 0 ? (
                <Card>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz yayınlanmış bir duyuru bulunmuyor.
                    </p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {announcements.map(a => (
                        <Card key={a.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{a.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    📅 {a.created_at ? new Date(a.created_at).toLocaleString('tr-TR') : '-'}
                                </span>
                            </div>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                {a.content}
                            </p>
                            {a.summary && (
                                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#0369a1', margin: 0, lineHeight: '1.5' }}>
                                        <strong>✨ AI Özeti:</strong> {a.summary}
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
