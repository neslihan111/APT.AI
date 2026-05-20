import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { api } from '../../services/api';

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/auth/users')
            .then(res => setUsers(res.data))
            .catch(err => {
                setError('Kullanıcılar yüklenemedi');
                console.error('Kullanıcılar yüklenemedi:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Ad Soyad', accessor: 'full_name' },
        { header: 'E-posta', accessor: 'email' },
        { header: 'Telefon', render: (row) => row.phone || '-' },
        { header: 'Rol', render: (row) => row.role === 'admin' ? '🛡️ Yönetici' : 'Sakin' },
    ];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Kullanıcı Listesi</h1>

            {error && (
                <div style={{
                    backgroundColor: '#fee2e2', color: '#b91c1c',
                    padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem',
                    fontSize: '0.875rem', fontWeight: 500
                }}>{error}</div>
            )}

            <Card>
                {users.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        Henüz kayıtlı kullanıcı bulunmuyor.
                    </p>
                ) : (
                    <Table columns={columns} data={users} />
                )}
            </Card>
        </div>
    );
};
