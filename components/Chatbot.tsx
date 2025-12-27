
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Szia! De jó, hogy itt vagy! 😊 Én a Kincsek Klub kis segítője vagyok. Miben tudok segíteni?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.concat(userMessage).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await sendMessageToGemini(history);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "Bocsi, most kicsit elveszítettem a fonalat, de próbáljuk újra!" }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 focus:outline-none border-2 ${
          isOpen ? 'bg-white border-red-500 rotate-90' : 'bg-red-500 border-white/20 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <span className="text-3xl">✨</span>
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[320px] sm:w-[400px] glass rounded-[35px] shadow-2xl border border-white/40 flex flex-col overflow-hidden animate-scaleUp origin-bottom-right">
          <div className="bg-red-500 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 animate-pulse text-2xl">
                🧚
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">Kincsek Segítő</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Mondd el bátran!</p>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow h-[400px] overflow-y-auto p-6 space-y-6 bg-white/40"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-900 border border-red-50 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/70 p-4 rounded-2xl flex space-x-1 border border-red-50">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-red-50 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ide írd a kérdésed..."
              className="flex-grow px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-[15px] font-semibold text-gray-900 placeholder-gray-400"
            />
            <button 
              onClick={handleSend}
              className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
