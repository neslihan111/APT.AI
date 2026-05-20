import { useEffect, useState } from 'react';
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
