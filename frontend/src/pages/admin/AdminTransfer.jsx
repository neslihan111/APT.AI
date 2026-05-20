import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminTransfer = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferring, setTransferring] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadResidents = async () => {
            try {
                const res = await api.get('/admin/residents');
                setUsers(res.data);
            } catch (err) {
                setError('Kullanıcı listesi yüklenemedi');
                console.error('Kullanıcılar yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        };
        loadResidents();
    }, []);

    const handleTransferClick = (user) => {
        setSelectedUser(user);
        setShowConfirm(true);
        setError('');
        setSuccess('');
    };

    const handleTransferConfirm = async () => {
        if (!selectedUser) return;
        setTransferring(true);
        setError('');

        try {
            await api.put('/admin/transfer', { new_admin_id: selectedUser.id });
            setSuccess(
                `Yöneticilik başarıyla "${selectedUser.full_name}" kullanıcısına devredildi. ` +
                'Oturumunuz sonlandırılacak...'
            );
            setShowConfirm(false);

            // Logout after 2 seconds since current user is no longer admin
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2500);
        } catch (err) {
            const message = err.response?.data?.detail || 'Yönetici devretme işlemi başarısız oldu.';
            setError(message);
        } finally {
            setTransferring(false);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Ad Soyad', accessor: 'full_name' },
        { header: 'E-posta', accessor: 'email' },
        { header: 'Telefon', render: (row) => row.phone || '-' },
        {
            header: 'İşlem',
            render: (row) => (
                <Button
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => handleTransferClick(row)}
                    disabled={transferring}
                >
                    Yönetici Yap
                </Button>
            ),
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">Yöneticiyi Devret</h1>

            {error && (
                <div style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}>
                    {success}
                </div>
            )}

            {/* Current Admin Info */}
            <Card className="mb-6" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>👤</div>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem' }}>Mevcut Yönetici</h3>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            {currentUser?.name} ({currentUser?.email})
                        </p>
                    </div>
                </div>
            </Card>

            {/* Warning */}
            <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
            }}>
                <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                    <strong>Dikkat:</strong> Yöneticilik devredildikten sonra admin yetkileri yeni yöneticiye geçecek
                    ve siz apartman sakini rolüne döneceksiniz. Bu işlem geri alınamaz (yeni yönetici size tekrar devredebilir).
                </p>
            </div>

            {/* User list */}
            <Card>
                <h3 style={{ marginBottom: '1rem' }}>Kullanıcı Seç</h3>
                {users.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>
                        Henüz yöneticilik devredilecek kullanıcı bulunmuyor.
                    </p>
                ) : (
                    <Table columns={columns} data={users} />
                )}
            </Card>

            {/* Confirmation Modal */}
            {showConfirm && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    }}>
                        <h3 style={{ marginBottom: '1rem' }}>Yöneticilik Devri Onayı</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Yöneticilik <strong>{selectedUser.full_name}</strong> ({selectedUser.email}) 
                            kullanıcısına devredilecek. Bu işlemi onaylıyor musunuz?
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <Button
                                className="btn-outline"
                                onClick={() => setShowConfirm(false)}
                                disabled={transferring}
                            >
                                İptal
                            </Button>
                            <Button
                                className="btn-danger"
                                onClick={handleTransferConfirm}
                                disabled={transferring}
                            >
                                {transferring ? 'Devrediliyor...' : 'Onayla ve Devret'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
