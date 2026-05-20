import { useEffect, useState } from 'react';
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
