import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email, password);
            if (res.user.role === 'pending_admin') {
                import('../../services/authService').then(m => m.logout());
                throw new Error("Hesabınız henüz onay bekliyor. Onaylandıktan sonra panele erişebilirsiniz.");
            }
            authLogin(res.user, res.token);
            if (res.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.detail || error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <Input label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" className="mt-4 w-full" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
            <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                Hesabınız yok mu? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Kayıt Ol</Link>
            </p>
        </form>
    );
};
