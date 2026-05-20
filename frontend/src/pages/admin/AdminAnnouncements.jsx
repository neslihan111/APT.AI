import { useEffect, useState } from 'react';
import { getAnnouncements } from '../../services/announcementService';
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
