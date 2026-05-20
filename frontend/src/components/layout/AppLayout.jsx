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
