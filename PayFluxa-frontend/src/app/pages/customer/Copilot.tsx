import React, { useState, useRef, useEffect } from 'react';
import { sendCopilotMessage, ChatMessage, CopilotResponse } from '../../services/copilotService';
import { Send, AlertTriangle, Lightbulb, Activity } from 'lucide-react'; 

export default function Copilot() {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        role: 'assistant',
        content: "Hello! I'm your PayFluxa Copilot. Ask me anything about your loans, cashflow health, or future investment strategies."
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [latestData, setLatestData] = useState<CopilotResponse | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userText = input;
        const currentHistory = [...messages]; 
        
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendCopilotMessage(userText, currentHistory);
            
            setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
            setLatestData(response);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 p-6 bg-gray-50">
            {/* Left Chat Interface */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-white font-semibold text-gray-800 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600"/> Copilot Chat
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-sm' 
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                            }`}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 p-4 rounded-xl rounded-bl-sm text-gray-400 text-sm animate-pulse shadow-sm">
                                Analyzing financial data...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                    <input 
                        type="text" 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Ask about a loan restructuring or investment idea..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Right Dashboard Panel */}
            <div className="w-[350px] flex flex-col gap-4 overflow-y-auto">
                {latestData?.metrics && (
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Live Twin Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 font-medium">Health Score</span>
                                <span className="font-bold text-lg text-blue-600">{latestData.metrics.health_score}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${latestData.metrics.health_score}%` }}></div>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-600 font-medium">12m Survival Prob.</span>
                                <span className="font-bold text-lg text-emerald-600">{(latestData.metrics.survival_probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {latestData?.warnings && latestData.warnings.length > 0 && (
                    <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                        <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3 text-sm">
                            <AlertTriangle size={16} /> Risk Alerts
                        </h3>
                        <ul className="space-y-2">
                            {latestData.warnings.map((w, i) => (
                                <li key={i} className="text-sm text-red-700 leading-relaxed border-l-2 border-red-300 pl-3">{w}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {latestData?.recommendations && latestData.recommendations.length > 0 && (
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-3 text-sm">
                            <Lightbulb size={16} /> Strategic Actions
                        </h3>
                        <ul className="space-y-3">
                            {latestData.recommendations.map((r, i) => (
                                <li key={i} className="text-sm text-blue-800 leading-relaxed flex gap-2">
                                    <span className="text-blue-400 mt-0.5">•</span>
                                    <span>{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}