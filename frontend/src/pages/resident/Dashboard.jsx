import { Card } from '../../components/ui/Card';

export const Dashboard = () => {
    return (
        <div>
            <h1 className="mb-6">Hoşgeldiniz</h1>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <Card title="Bekleyen Aidat">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>500 TL</p>
                </Card>
                <Card title="Açık Şikayetler">
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</p>
                </Card>
                <Card title="Son Duyuru">
                    <p>Yarın sabah su kesintisi...</p>
                </Card>
            </div>
        </div>
    );
};
