import { useNavigate } from 'react-router-dom';
import { AIChat } from '../../components/ui/AIChat';

export const AIAssistant = () => {
    const navigate = useNavigate();

    const suggestions = [
        "Ödenmemiş aidatım var mı?",
        "Son duyuru ne?",
        "Şikayetlerim ne durumda?",
        "Daire bilgilerim ne?"
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>AI Asistan</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Site hakkındaki bilgilerinizi, aidatlarınızı veya şikayetlerinizi bana sorabilirsiniz.
            </p>
            
            <div style={{ maxWidth: '800px' }}>
                <AIChat 
                    suggestions={suggestions} 
                    onNavigate={(path) => navigate(path)} 
                />
            </div>
        </div>
    );
};
