import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Bell, AlertTriangle, CreditCard, User, Users, Activity, LogOut, Building2, KeyRound, ArrowRightLeft } from 'lucide-react';
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
        { to: "/admin/users", label: "Kullanıcılar", icon: <Users size={20} /> },
        { to: "/admin/buildings", label: "Bina Yönetimi", icon: <Building2 size={20} /> },
        { to: "/admin/invite-codes", label: "Davet Kodları", icon: <KeyRound size={20} /> },
        { to: "/admin/transfer", label: "Yönetici Devret", icon: <ArrowRightLeft size={20} /> },
        { to: "/admin/ai-insights", label: "AI Analiz", icon: <Activity size={20} /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : residentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>APT.AI</h2>
                {user?.role === 'admin' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                        Yönetici Paneli
                    </span>
                )}
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
