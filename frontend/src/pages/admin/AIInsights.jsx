import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInsights } from '../../services/aiService';
import { Card } from '../../components/ui/Card';
import { AIChat } from '../../components/ui/AIChat';

export const AIInsights = () => {
    const navigate = useNavigate();
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadInsights = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDashboardInsights();
            setInsights(data);
        } catch (err) {
            console.error("AI Insights load error:", err);
            // Check status code, redirect if 401
            if (err.response && err.response.status === 401) {
                navigate('/login');
                return;
            }
            // If Gemini quota fails, we might still have a partial response or error.
            // But if the request fails completely (e.g. 500), show error.
            setError(err.response?.data?.detail || err.message || 'AI Analiz verileri yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInsights();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-muted)' }}>AI Analiz raporu hazırlanıyor...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <Card style={{ borderColor: 'var(--danger)', maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Analiz Yüklenemedi</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
                    <button 
                        onClick={loadInsights}
                        style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Tekrar Dene
                    </button>
                </Card>
            </div>
        );
    }

    const hasNoIssues = !insights || (!insights.summary && (!insights.repeating_issues || insights.repeating_issues.length === 0) && (!insights.suggestions || insights.suggestions.length === 0));

    if (hasNoIssues) {
        return (
            <div>
                <h1 className="mb-6">AI Analiz Ekranı</h1>
                <Card>
                    <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💡</div>
                        <h3>Yeterli Şikayet Verisi Yok</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            AI analizi gerçekleştirebilmek için apartman veya sitenizde şikayet kayıtlarının olması gerekmektedir.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-6">AI Analiz Ekranı</h1>
            
            <div className="grid grid-cols-1 gap-6">
                <Card title="Genel Durum Özeti">
                    <div className="p-4" style={{ backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>{insights.summary || 'Şikayet verisi bulunmadığından haftalık AI analiz raporu oluşturulamadı.'}</p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <Card title="Tekrar Eden Sorunlar">
                        {insights.repeating_issues && insights.repeating_issues.length > 0 ? (
                            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                                {insights.repeating_issues.map((issue, i) => (
                                    <li key={i} className="mb-2" style={{ lineHeight: '1.4' }}>{issue}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tekrar eden sorun tespit edilmedi.</p>
                        )}
                    </Card>

                    <Card title="AI Önerileri">
                        {insights.suggestions && insights.suggestions.length > 0 ? (
                            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                                {insights.suggestions.map((suggestion, i) => (
                                    <li key={i} className="mb-2" style={{ color: '#0369a1', lineHeight: '1.4' }}>{suggestion}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Yeni öneri bulunmuyor.</p>
                        )}
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
