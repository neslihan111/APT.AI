import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyComplaints } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const data = await getMyComplaints();
            setComplaints(data);
        } catch {
            setError('Şikayetleriniz yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Şikayetlerim</h1>
                <Button className="btn-primary" onClick={() => navigate('/complaints/new')}>
                    + Yeni Şikayet Ekle
                </Button>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

            {complaints.length === 0 ? (
                <Card>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz oluşturulmuş bir şikayetiniz bulunmuyor. Yeni şikayet oluşturmak için yukarıdaki butonu kullanın.
                    </p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {complaints.map(c => (
                        <Card key={c.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{c.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        📅 {c.created_at ? new Date(c.created_at).toLocaleString('tr-TR') : '-'}
                                    </span>
                                </div>
                                <Badge variant={c.status === 'pending' ? 'warning' : 'success'}>
                                    {c.status === 'pending' ? 'Beklemede' : 'Çözüldü'}
                                </Badge>
                            </div>
                            
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', lineHeight: '1.6' }}>
                                {c.description}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Badge variant="info">{c.category || 'Belirsiz'}</Badge>
                                <Badge variant={c.priority === 'high' ? 'danger' : c.priority === 'low' ? 'success' : 'warning'}>
                                    Öncelik: {c.priority === 'high' ? 'Yüksek' : c.priority === 'low' ? 'Düşük' : 'Orta'}
                                </Badge>
                            </div>

                            {c.ai_summary && (
                                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.75rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                                        <strong>🤖 AI Özeti:</strong> {c.ai_summary}
                                    </p>
                                </div>
                            )}

                            {c.suggestion && (
                                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0, lineHeight: '1.5' }}>
                                        <strong>💡 Yönetici Önerisi (AI):</strong> {c.suggestion}
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
