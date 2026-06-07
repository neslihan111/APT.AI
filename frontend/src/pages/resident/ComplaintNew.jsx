import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const ComplaintNew = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await createComplaint(formData);
            navigate('/complaints/my');
        } catch (err) {
            setError(err.response?.data?.detail || 'Şikayet oluşturulurken bir hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Button className="btn-outline" onClick={() => navigate('/complaints/my')} style={{ padding: '0.5rem 0.75rem' }}>
                    ⬅️ Geri
                </Button>
                <h1>Yeni Şikayet Bildirimi</h1>
            </div>
            
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

            <Card>
                <form onSubmit={handleSubmit}>
                    <Input label="Şikayet Başlığı *" placeholder="Şikayetinizi özetleyen kısa bir başlık yazın" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Textarea label="Şikayet Detayı *" placeholder="Lütfen detayları açıkça belirtin. AI bu detayı analiz ederek kategori, öncelik ve öneri atayacaktır." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                        <Button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Gönderiliyor ve AI Analizi Yapılıyor...' : 'Şikayeti Bildir (AI Analizli)'}
                        </Button>
                        <Button type="button" className="btn-outline" onClick={() => navigate('/complaints/my')} disabled={submitting}>
                            İptal
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
