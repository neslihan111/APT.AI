import { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';

export const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        getComplaints().then(setComplaints).catch(console.error);
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateComplaintStatus(id, newStatus);
            const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
            setComplaints(updated);
        } catch (error) {
            console.error('Durum güncellenemedi:', error);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Başlık', accessor: 'title' },
        { header: 'Kategori', render: (row) => <Badge variant="info">{row.category || 'Belirsiz'}</Badge> },
        { header: 'Öncelik', render: (row) => (
            <span className={`badge ${row.priority === 'high' ? 'badge-danger' : row.priority === 'low' ? 'badge-success' : 'badge-warning'}`}>
                {row.priority || 'medium'}
            </span>
        )},
        { header: 'Durum', render: (row) => (
            <select 
                value={row.status} 
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
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
