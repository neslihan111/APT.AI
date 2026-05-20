import { useEffect, useState } from 'react';
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
