import os

base_dir = "src"

dirs = [
    "components/ui",
    "components/layout",
    "components/navigation",
    "components/shared",
    "pages",
    "pages/admin",
    "pages/resident",
    "pages/auth",
    "services",
    "context"
]

for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {
    "src/index.css": """
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary: #64748b;
  --background: #f8fafc;
  --surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;

  --priority-high-bg: #fee2e2;
  --priority-high-text: #b91c1c;
  --priority-medium-bg: #fef3c7;
  --priority-medium-text: #b45309;
  --priority-low-bg: #dcfce3;
  --priority-low-text: #15803d;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background);
  color: var(--text-main);
  line-height: 1.5;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.text-center { text-align: center; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

@media (max-width: 768px) {
  .grid-cols-2, .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
""",
    "src/services/api.js": """
const BASE_URL = 'http://127.0.0.1:8000';

export const api = {
    get: async (url) => {
        // mock for now
        console.log(`GET ${url}`);
        return { data: [] };
    },
    post: async (url, data) => {
        console.log(`POST ${url}`, data);
        return { data };
    },
    put: async (url, data) => {
        console.log(`PUT ${url}`, data);
        return { data };
    },
    delete: async (url) => {
        console.log(`DELETE ${url}`);
        return { success: true };
    }
};
""",
    "src/services/authService.js": """
export const login = async (email, password) => {
    return { token: "mock-token", user: { id: 1, name: "Test User", role: email.includes("admin") ? "admin" : "resident" } };
};

export const register = async (userData) => {
    return { success: true };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
""",
    "src/services/complaintService.js": """
const mockComplaints = [
    { id: 1, title: "Asansör Bozuk", description: "A blok asansörü çalışmıyor.", status: "pending", category: "Teknik", priority: "high", ai_summary: "A blok asansör arızası", created_at: "2026-04-30" },
    { id: 2, title: "Gürültü", description: "Üst kattan ses geliyor.", status: "resolved", category: "Güvenlik", priority: "low", ai_summary: "Komşu gürültü şikayeti", created_at: "2026-04-29" }
];

export const getComplaints = async () => mockComplaints;
export const getMyComplaints = async () => mockComplaints;
export const createComplaint = async (data) => ({ id: 3, ...data, status: "pending" });
export const updateComplaintStatus = async (id, status) => ({ id, status });
""",
    "src/services/announcementService.js": """
const mockAnnouncements = [
    { id: 1, title: "Su Kesintisi", content: "Yarın sabah su kesintisi olacaktır.", summary: "Yarın sabah su kesintisi", created_at: "2026-04-30" }
];

export const getAnnouncements = async () => mockAnnouncements;
export const createAnnouncement = async (data) => ({ id: 2, ...data });
""",
    "src/services/dueService.js": """
const mockDues = [
    { id: 1, amount: 500, due_date: "2026-05-01", status: "unpaid" },
    { id: 2, amount: 500, due_date: "2026-04-01", status: "paid" }
];

export const getMyDues = async () => mockDues;
export const getAllDues = async () => mockDues;
export const addDue = async (data) => ({ id: 3, ...data });
""",
    "src/services/aiService.js": """
export const getDashboardInsights = async () => {
    return {
        summary: "Son 1 haftada şikayetler %20 arttı. Genellikle asansör arızaları görülüyor.",
        repeating_issues: ["Asansör arızası (3 kez)", "Otopark temizliği (2 kez)"],
        suggestions: ["Asansör bakım periyodunu sıklaştırın."]
    };
};
""",
    "src/components/ui/Button.jsx": """
import React from 'react';
import './ui.css';

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
    return (
        <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
""",
    "src/components/ui/Input.jsx": """
import React from 'react';
import './ui.css';

export const Input = ({ label, type = 'text', value, onChange, placeholder, className = '' }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label>{label}</label>}
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
        </div>
    );
};
""",
    "src/components/ui/Textarea.jsx": """
import React from 'react';
import './ui.css';

export const Textarea = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label>{label}</label>}
            <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="input-field" />
        </div>
    );
};
""",
    "src/components/ui/Card.jsx": """
import React from 'react';
import './ui.css';

export const Card = ({ children, className = '', title }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};
""",
    "src/components/ui/Badge.jsx": """
import React from 'react';
import './ui.css';

export const Badge = ({ children, variant = 'info', className = '' }) => {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {children}
        </span>
    );
};
""",
    "src/components/ui/Table.jsx": """
import React from 'react';
import './ui.css';

export const Table = ({ columns, data }) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col, i) => <th key={i}>{col.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col, j) => <td key={j}>{col.render ? col.render(row) : row[col.accessor]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
""",
    "src/components/ui/ui.css": """
.btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
.btn-primary { background-color: var(--primary); color: white; }
.btn-primary:hover { background-color: var(--primary-hover); }
.btn-outline { background-color: transparent; border: 1px solid var(--border); color: var(--text-main); }
.btn-outline:hover { background-color: var(--background); }
.btn-danger { background-color: var(--danger); color: white; }

.input-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
.input-group label { font-size: 0.875rem; font-weight: 500; color: var(--text-main); }
.input-field {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
}
.input-field:focus { border-color: var(--primary); }

.card {
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.card-title { margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600; }

.badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-block;
}
.badge-info { background-color: #e0f2fe; color: #0369a1; }
.badge-success { background-color: #dcfce3; color: #15803d; }
.badge-warning { background-color: #fef3c7; color: #b45309; }
.badge-danger { background-color: #fee2e2; color: #b91c1c; }

.table-container { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.table th, .table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); }
.table th { background-color: var(--background); font-weight: 600; font-size: 0.875rem; color: var(--text-muted); }
""",
    "src/context/AuthContext.jsx": """
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
""",
    "src/components/navigation/ProtectedRoute.jsx": """
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Yükleniyor...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
""",
    "src/components/navigation/Sidebar.jsx": """
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Bell, AlertTriangle, CreditCard, User, Users, Activity, LogOut } from 'lucide-react';
import './navigation.css';

export const Sidebar = () => {
    const { user, logout } = useAuth();

    const residentLinks = [
        { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
        { to: "/announcements", label: "Duyurular", icon: <Bell size={20} /> },
        { to: "/complaints/new", label: "Şikayet Oluştur", icon: <AlertTriangle size={20} /> },
        { to: "/complaints/my", label: "Şikayetlerim", icon: <AlertTriangle size={20} /> },
        { to: "/dues/my", label: "Aidatlarım", icon: <CreditCard size={20} /> },
        { to: "/profile", label: "Profil", icon: <User size={20} /> },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: "Yönetici Paneli", icon: <Activity size={20} /> },
        { to: "/admin/complaints", label: "Tüm Şikayetler", icon: <AlertTriangle size={20} /> },
        { to: "/admin/announcements", label: "Duyuru Yönetimi", icon: <Bell size={20} /> },
        { to: "/admin/dues", label: "Aidat Yönetimi", icon: <CreditCard size={20} /> },
        { to: "/admin/users", label: "Kullanıcı Listesi", icon: <Users size={20} /> },
        { to: "/admin/ai-insights", label: "AI Analiz Ekranı", icon: <Activity size={20} /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : residentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>APT.AI</h2>
            </div>
            <nav className="sidebar-nav">
                {links.map((link, i) => (
                    <NavLink key={i} to={link.to} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button onClick={logout} className="nav-link logout-btn">
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
};
""",
    "src/components/layout/AppLayout.jsx": """
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import './layout.css';

export const AppLayout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
""",
    "src/components/layout/AuthLayout.jsx": """
import React from 'react';
import { Outlet } from 'react-router-dom';
import './layout.css';

export const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>APT.AI</h2>
                    <p>Apartman & Site Yönetim Sistemi</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};
""",
    "src/components/layout/layout.css": """
.app-layout { display: flex; min-height: 100vh; background-color: var(--background); }
.main-content { flex: 1; padding: 2rem; overflow-y: auto; }
.content-container { max-width: 1200px; margin: 0 auto; }

.auth-layout { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--background); padding: 1rem; }
.auth-card { background: var(--surface); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.auth-header { text-align: center; margin-bottom: 2rem; }
.auth-header h2 { color: var(--primary); font-size: 2rem; margin-bottom: 0.5rem; }
.auth-header p { color: var(--text-muted); }
""",
    "src/components/navigation/navigation.css": """
.sidebar { width: 250px; background-color: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
.sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border); }
.sidebar-header h2 { color: var(--primary); font-size: 1.5rem; margin: 0; }
.sidebar-nav { flex: 1; padding: 1rem 0; display: flex; flex-direction: column; gap: 0.25rem; }
.nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; color: var(--text-muted); transition: all 0.2s; font-weight: 500; }
.nav-link:hover { background-color: var(--background); color: var(--text-main); }
.nav-link.active { background-color: #e0f2fe; color: var(--primary); border-right: 3px solid var(--primary); }
.sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); }
.logout-btn { background: none; border: none; width: 100%; text-align: left; cursor: pointer; color: var(--danger); }
.logout-btn:hover { background-color: #fee2e2; color: var(--danger); }
""",
    "src/pages/auth/Login.jsx": """
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            authLogin(res.user, res.token);
            if (res.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" className="mt-4 w-full" style={{ width: '100%' }}>Giriş Yap</Button>
            <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                Hesabınız yok mu? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Kayıt Ol</Link>
            </p>
        </form>
    );
};
""",
    "src/pages/auth/Register.jsx": """
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'resident' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Ad Soyad" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <Input label="E-posta" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <Input label="Şifre" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <div className="input-group">
                <label>Rol</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="resident">Apartman Sakini</option>
                    <option value="admin">Yönetici</option>
                </select>
            </div>
            <Button type="submit" className="mt-4 w-full" style={{ width: '100%' }}>Kayıt Ol</Button>
            <p className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
                Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Giriş Yap</Link>
            </p>
        </form>
    );
};
""",
    "src/pages/resident/Dashboard.jsx": """
import React from 'react';
import { Card } from '../../components/ui/Card';

export const Dashboard = () => {
    return (
        <div>
            <h1 className="mb-6">Hoşgeldiniz</h1>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <Card title="Bekleyen Aidat">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>500 TL</p>
                </Card>
                <Card title="Açık Şikayetler">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</p>
                </Card>
                <Card title="Son Duyuru">
                    <p>Yarın sabah su kesintisi...</p>
                </Card>
            </div>
        </div>
    );
};
""",
    "src/pages/resident/Announcements.jsx": """
import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../../services/announcementService';
import { Card } from '../../components/ui/Card';

export const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        getAnnouncements().then(setAnnouncements);
    }, []);

    return (
        <div>
            <h1 className="mb-6">Duyurular</h1>
            <div className="flex flex-col gap-4">
                {announcements.map(a => (
                    <Card key={a.id} title={a.title}>
                        <p className="mb-2 text-muted" style={{ fontSize: '0.875rem' }}>{a.created_at}</p>
                        <p>{a.content}</p>
                        <div className="mt-4 p-3" style={{ backgroundColor: '#e0f2fe', borderRadius: '6px' }}>
                            <p style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 500 }}>✨ AI Özeti: {a.summary}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
""",
    "src/pages/resident/ComplaintNew.jsx": """
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const ComplaintNew = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createComplaint(formData);
        navigate('/complaints/my');
    };

    return (
        <div>
            <h1 className="mb-6">Yeni Şikayet Oluştur</h1>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Input label="Başlık" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Textarea label="Açıklama" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <Button type="submit" className="mt-4">Gönder</Button>
                </form>
            </Card>
        </div>
    );
};
""",
    "src/pages/resident/Complaints.jsx": """
import React, { useEffect, useState } from 'react';
import { getMyComplaints } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        getMyComplaints().then(setComplaints);
    }, []);

    return (
        <div>
            <h1 className="mb-6">Şikayetlerim</h1>
            <div className="flex flex-col gap-4">
                {complaints.map(c => (
                    <Card key={c.id}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{c.title}</h3>
                            <Badge variant={c.status === 'pending' ? 'warning' : 'success'}>
                                {c.status === 'pending' ? 'Beklemede' : 'Çözüldü'}
                            </Badge>
                        </div>
                        <p className="mb-4">{c.description}</p>
                        <div className="flex gap-2 mb-4">
                            <span className="badge badge-info">{c.category}</span>
                            <span className={`badge ${c.priority === 'high' ? 'badge-danger' : c.priority === 'low' ? 'badge-success' : 'badge-warning'}`}>
                                Öncelik: {c.priority}
                            </span>
                        </div>
                        {c.ai_summary && (
                            <div className="p-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                <p style={{ fontSize: '0.875rem', color: '#475569' }}>🤖 AI Özeti: {c.ai_summary}</p>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
""",
    "src/pages/resident/Dues.jsx": """
import React, { useEffect, useState } from 'react';
import { getMyDues } from '../../services/dueService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Dues = () => {
    const [dues, setDues] = useState([]);

    useEffect(() => {
        getMyDues().then(setDues);
    }, []);

    return (
        <div>
            <h1 className="mb-6">Aidatlarım</h1>
            <div className="flex flex-col gap-4">
                {dues.map(d => (
                    <Card key={d.id} className="flex justify-between items-center">
                        <div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{d.amount} TL</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Son Ödeme: {d.due_date}</p>
                        </div>
                        <Badge variant={d.status === 'paid' ? 'success' : 'danger'}>
                            {d.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}
                        </Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
};
""",
    "src/pages/resident/Profile.jsx": """
import React from 'react';
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
""",
    "src/pages/admin/AdminDashboard.jsx": """
import React from 'react';
import { Card } from '../../components/ui/Card';

export const AdminDashboard = () => {
    return (
        <div>
            <h1 className="mb-6">Yönetici Paneli</h1>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <Card title="Toplam Şikayet">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>15</p>
                </Card>
                <Card title="Açık Şikayetler">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</p>
                </Card>
                <Card title="Toplam Sakin">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24</p>
                </Card>
            </div>
            
            <h2 className="mb-4">AI Hızlı Özet</h2>
            <Card className="mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="flex items-start gap-4">
                    <div style={{ fontSize: '2rem' }}>🤖</div>
                    <div>
                        <h3 className="mb-2" style={{ color: '#166534' }}>Haftalık Durum Raporu</h3>
                        <p style={{ color: '#15803d' }}>Bu hafta otopark ile ilgili şikayetlerde artış gözlemleniyor. Genel aidat ödeme oranı %85.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
""",
    "src/pages/admin/AdminComplaints.jsx": """
import React, { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        getComplaints().then(setComplaints);
    }, []);

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Başlık', accessor: 'title' },
        { header: 'Kategori', render: (row) => <Badge variant="info">{row.category}</Badge> },
        { header: 'Öncelik', render: (row) => (
            <span className={`badge ${row.priority === 'high' ? 'badge-danger' : row.priority === 'low' ? 'badge-success' : 'badge-warning'}`}>
                {row.priority}
            </span>
        )},
        { header: 'Durum', render: (row) => (
            <select 
                value={row.status} 
                onChange={(e) => {
                    // mock update
                    const updated = complaints.map(c => c.id === row.id ? { ...c, status: e.target.value } : c);
                    setComplaints(updated);
                }}
                style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            >
                <option value="pending">Beklemede</option>
                <option value="resolved">Çözüldü</option>
            </select>
        )}
    ];

    return (
        <div>
            <h1 className="mb-6">Tüm Şikayetler</h1>
            <Card>
                <Table columns={columns} data={complaints} />
            </Card>
        </div>
    );
};
""",
    "src/pages/admin/AdminAnnouncements.jsx": """
import React, { useEffect, useState } from 'react';
import { getAnnouncements, createAnnouncement } from '../../services/announcementService';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';

export const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        getAnnouncements().then(setAnnouncements);
    }, []);

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Başlık', accessor: 'title' },
        { header: 'Tarih', accessor: 'created_at' },
        { header: 'İşlem', render: () => <Button variant="outline">Düzenle</Button> }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1>Duyuru Yönetimi</h1>
                <Button>Yeni Duyuru Ekle</Button>
            </div>
            <Card>
                <Table columns={columns} data={announcements} />
            </Card>
        </div>
    );
};
""",
    "src/pages/admin/AdminDues.jsx": """
import React, { useEffect, useState } from 'react';
import { getAllDues } from '../../services/dueService';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminDues = () => {
    const [dues, setDues] = useState([]);

    useEffect(() => {
        getAllDues().then(setDues);
    }, []);

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Tutar', render: (row) => `${row.amount} TL` },
        { header: 'Son Ödeme', accessor: 'due_date' },
        { header: 'Durum', render: (row) => <Badge variant={row.status === 'paid' ? 'success' : 'danger'}>{row.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}</Badge> },
        { header: 'İşlem', render: () => <Button variant="outline">Düzenle</Button> }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1>Aidat Yönetimi</h1>
                <Button>Aidat Ekle</Button>
            </div>
            <Card>
                <Table columns={columns} data={dues} />
            </Card>
        </div>
    );
};
""",
    "src/pages/admin/AdminUsers.jsx": """
import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';

export const AdminUsers = () => {
    const users = [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'resident' },
        { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', role: 'admin' },
    ];

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Ad Soyad', accessor: 'name' },
        { header: 'E-posta', accessor: 'email' },
        { header: 'Rol', render: (row) => row.role === 'admin' ? 'Yönetici' : 'Sakin' }
    ];

    return (
        <div>
            <h1 className="mb-6">Kullanıcı Listesi</h1>
            <Card>
                <Table columns={columns} data={users} />
            </Card>
        </div>
    );
};
""",
    "src/pages/admin/AIInsights.jsx": """
import React, { useEffect, useState } from 'react';
import { getDashboardInsights } from '../../services/aiService';
import { Card } from '../../components/ui/Card';

export const AIInsights = () => {
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        getDashboardInsights().then(setInsights);
    }, []);

    if (!insights) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">AI Analiz Ekranı</h1>
            
            <div className="grid grid-cols-1 gap-6">
                <Card title="Genel Durum Özeti">
                    <div className="p-4" style={{ backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <p>{insights.summary}</p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <Card title="Tekrar Eden Sorunlar">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {insights.repeating_issues.map((issue, i) => (
                                <li key={i} className="mb-2">{issue}</li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="AI Önerileri">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {insights.suggestions.map((suggestion, i) => (
                                <li key={i} className="mb-2" style={{ color: '#0369a1' }}>{suggestion}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};
""",
    "src/App.jsx": """
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute } from './components/navigation/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Resident Pages
import { Dashboard } from './pages/resident/Dashboard';
import { Announcements } from './pages/resident/Announcements';
import { Complaints } from './pages/resident/Complaints';
import { ComplaintNew } from './pages/resident/ComplaintNew';
import { Dues } from './pages/resident/Dues';
import { Profile } from './pages/resident/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminDues } from './pages/admin/AdminDues';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AIInsights } from './pages/admin/AIInsights';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                        {/* Resident Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/announcements" element={<Announcements />} />
                        <Route path="/complaints/my" element={<Complaints />} />
                        <Route path="/complaints/new" element={<ComplaintNew />} />
                        <Route path="/dues/my" element={<Dues />} />
                        <Route path="/profile" element={<Profile />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Outlet /></ProtectedRoute>}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="complaints" element={<AdminComplaints />} />
                            <Route path="announcements" element={<AdminAnnouncements />} />
                            <Route path="dues" element={<AdminDues />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="ai-insights" element={<AIInsights />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
""",
    "src/main.jsx": """
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
"""
}

for path, content in files.items():
    with open(os.path.join(base_dir, "..", path), "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

print("Scaffold completed.")
