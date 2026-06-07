import { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const data = await getComplaints();
            setComplaints(data);
        } catch (err) {
            setError('Şikayetler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setError('');
            setSuccess('');
            await updateComplaintStatus(id, newStatus);
            setSuccess('Şikayet durumu güncellendi.');
            const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
            setComplaints(updated);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Şikayet durumu güncellenemedi.');
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Sakin Şikayetleri</h1>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

            {complaints.length === 0 ? (
                <Card>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz herhangi bir sakin şikayeti bulunmuyor.
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Durum:</span>
                                    <select 
                                        value={c.status} 
                                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                        style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff', fontWeight: 500 }}
                                    >
                                        <option value="pending">⏳ Beklemede</option>
                                        <option value="resolved">✅ Çözüldü</option>
                                    </select>
                                </div>
                            </div>
                            
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', lineHeight: '1.6' }}>
                                {c.description}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Badge variant="info">{c.category || 'Teknik'}</Badge>
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
                                        <strong>💡 Yönetici Çözüm Önerisi (AI):</strong> {c.suggestion}
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
