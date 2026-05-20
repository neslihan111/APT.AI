import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../services/complaintService';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const ComplaintNew = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createComplaint(formData);
        navigate('/complaints/my');
    };

    return (
        <div>
            <h1 className="mb-6">Yeni Şikayet Oluştur</h1>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Input label="Başlık" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Textarea label="Açıklama" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <Button type="submit" className="mt-4">Gönder</Button>
                </form>
            </Card>
        </div>
    );
};
