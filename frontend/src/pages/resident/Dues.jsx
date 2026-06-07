import { useEffect, useState } from 'react';
import { getMyDues } from '../../services/dueService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Dues = () => {
    const [dues, setDues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDues();
    }, []);

    const loadDues = async () => {
        try {
            const data = await getMyDues();
            setDues(data);
        } catch {
            setError('Aidat bilgileriniz yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Aidatlarım</h1>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

            {dues.length === 0 ? (
                <Card>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Adınıza kayıtlı herhangi bir aidat borcu bulunmuyor.
                    </p>
                </Card>
            ) : (
                <div className="flex flex-col gap-4">
                    {dues.map(d => (
                        <Card key={d.id} className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{d.amount} TL</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                                    📅 Son Ödeme: {d.due_date ? new Date(d.due_date).toLocaleDateString('tr-TR') : '-'}
                                </p>
                            </div>
                            <Badge variant={d.status === 'paid' ? 'success' : 'danger'}>
                                {d.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}
                            </Badge>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
