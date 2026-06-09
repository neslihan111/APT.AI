import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInsights } from '../../services/aiService';
import { Card } from '../../components/ui/Card';
import { AIChat } from '../../components/ui/AIChat';

export const AIInsights = () => {
    const navigate = useNavigate();
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        getDashboardInsights().then(setInsights);
    }, []);

    if (!insights) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h1 className="mb-6">AI Analiz Ekranı</h1>
            
            <div className="grid grid-cols-1 gap-6">
                <Card title="Genel Durum Özeti">
                    <div className="p-4" style={{ backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <p>{insights.summary}</p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <Card title="Tekrar Eden Sorunlar">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {insights.repeating_issues.map((issue, i) => (
                                <li key={i} className="mb-2">{issue}</li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="AI Önerileri">
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {insights.suggestions.map((suggestion, i) => (
                                <li key={i} className="mb-2" style={{ color: '#0369a1' }}>{suggestion}</li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <div className="mt-8">
                    <AIChat 
                        suggestions={[
                            "Aidatını ödemeyen var mı?",
                            "Bekleyen şikayetleri listele",
                            "En önemli sorun ne?",
                            "Aidatını ödemeyenlere uyarı gönder"
                        ]}
                        onNavigate={(path) => navigate(path)}
                    />
                </div>
            </div>
        </div>
    );
};
