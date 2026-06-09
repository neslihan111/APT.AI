import { useState, useRef, useEffect } from 'react';
import { sendAssistantMessage } from '../../services/aiService';
import { Card } from './Card';

export const AIChat = ({ suggestions = [], onNavigate }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Size nasıl yardımcı olabilirim?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (text = input) => {
        if (!text.trim() || loading) return;

        const userMsg = { role: 'user', text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendAssistantMessage(text);
            const assistantMsg = { 
                role: 'assistant', 
                text: response.answer,
                actions: response.actions || []
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'assistant', text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="🤖 AI Asistan" className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            style={{
                                maxWidth: '80%',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                backgroundColor: msg.role === 'user' ? 'var(--primary)' : '#fff',
                                color: msg.role === 'user' ? '#fff' : '#333',
                                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.text}</p>
                            
                            {msg.actions && msg.actions.length > 0 && (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {msg.actions.map((act, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => {
                                                if (act.type === 'navigate' && onNavigate && act.target) {
                                                    onNavigate(act.target);
                                                }
                                            }}
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: '#e0f2fe',
                                                color: '#0369a1',
                                                border: '1px solid #bae6fd',
                                                cursor: act.type === 'navigate' ? 'pointer' : 'default'
                                            }}
                                        >
                                            {act.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Yazıyor...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {suggestions.length > 0 && (
                <div style={{ padding: '10px', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s)}
                            disabled={loading}
                            style={{
                                fontSize: '0.8rem', padding: '6px 12px', borderRadius: '16px',
                                backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer',
                                color: '#475569'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Bana bir şey sorun..."
                    className="input-field"
                    style={{ flex: 1, margin: 0 }}
                    disabled={loading}
                />
                <button 
                    className="btn btn-primary"
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    style={{ margin: 0 }}
                >
                    Gönder
                </button>
            </div>
        </Card>
    );
};
