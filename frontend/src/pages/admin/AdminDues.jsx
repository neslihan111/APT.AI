import { useEffect, useState } from 'react';
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
