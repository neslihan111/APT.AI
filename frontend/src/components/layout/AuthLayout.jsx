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
