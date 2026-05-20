import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';

export const Profile = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="mb-6">Profilim</h1>
            <Card>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.875rem' }}>Ad Soyad</label>
                        <p style={{ fontWeight: 500 }}>{user?.name || 'Kullanıcı'}</p>
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.875rem' }}>E-posta</label>
                        <p style={{ fontWeight: 500 }}>{user?.email || 'kullanici@example.com'}</p>
                    </div>
                    <div>
                        <label className="text-muted" style={{ fontSize: '0.875rem' }}>Rol</label>
                        <p style={{ fontWeight: 500 }}>{user?.role === 'admin' ? 'Yönetici' : 'Apartman Sakini'}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
