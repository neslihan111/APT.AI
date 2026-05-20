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
import { AdminBuildings } from './pages/admin/AdminBuildings';
import { AdminInviteCodes } from './pages/admin/AdminInviteCodes';
import { AdminTransfer } from './pages/admin/AdminTransfer';
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
                            <Route path="buildings" element={<AdminBuildings />} />
                            <Route path="invite-codes" element={<AdminInviteCodes />} />
                            <Route path="transfer" element={<AdminTransfer />} />
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
