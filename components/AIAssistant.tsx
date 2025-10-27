import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Student } from '../types';
import { AIIcon, SendIcon } from './icons';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface AIAssistantProps {
  students: Student[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ students }) => {
  const [isEnabled, setIsEnabled] = useState(() => localStorage.getItem('aiAssistantEnabled') === 'true');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Halo! Saya Asisten Cerdas 7C. Ada yang bisa saya bantu terkait data siswa?', sender: 'ai' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSettingsChange = () => {
        setIsEnabled(localStorage.getItem('aiAssistantEnabled') === 'true');
    };
    
    window.addEventListener('storage', handleSettingsChange);
    window.addEventListener('settings-updated', handleSettingsChange);

    return () => {
        window.removeEventListener('storage', handleSettingsChange);
        window.removeEventListener('settings-updated', handleSettingsChange);
    };
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const customApiKey = localStorage.getItem('geminiApiKey');
      const apiKey = customApiKey || process.env.API_KEY;

      if (!apiKey) {
        throw new Error("API key tidak ditemukan. Harap atur API Key kustom Anda di halaman Pengaturan.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const studentDataContext = `Berikut adalah data siswa saat ini dalam format JSON: ${JSON.stringify(students)}`;
      
      const defaultPersonality = "Anda adalah 'Asisten Cerdas 7C', asisten AI untuk aplikasi manajemen data siswa. Tugas Anda adalah menjawab pertanyaan HANYA berdasarkan data siswa yang disediakan. Jika jawaban tidak ada di data, katakan Anda tidak memiliki informasi tersebut. Selalu jawab dalam Bahasa Indonesia dengan ramah dan membantu.";
      const savedPersonality = localStorage.getItem('aiPersonality') || defaultPersonality;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${studentDataContext}\n\nUser Question: ${userInput}`,
          config: {
            systemInstruction: savedPersonality,
          }
      });

      const aiMessage: Message = { text: response.text, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error communicating with AI:", error);
       const errorMessageText = (error instanceof Error && error.message.includes("API key")) 
        ? error.message 
        : 'Maaf, terjadi kesalahan saat menghubungi asisten AI. Pastikan API Key Anda valid dan coba lagi nanti.';
      const errorMessage: Message = { text: errorMessageText, sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[var(--primary-color)] text-white rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50"
        aria-label="Buka Asisten AI"
      >
        <AIIcon />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[60vh] max-h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transition-transform duration-300 origin-bottom-right animate-chat-pop-in">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-[var(--primary-color)]">Asisten Cerdas 7C</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              &times;
            </button>
          </header>

          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center space-x-1">
                      <span className="typing-dot"></span>
                      <span className="typing-dot" style={{animationDelay: '0.2s'}}></span>
                      <span className="typing-dot" style={{animationDelay: '0.4s'}}></span>
                  </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tanya sesuatu..."
              className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="bg-[var(--primary-color)] text-white p-3 rounded-full hover:brightness-110 disabled:bg-gray-400 disabled:cursor-not-allowed">
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
       <style>{`
          @keyframes chat-pop-in {
              from { transform: scale(0.5); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
          }
          .animate-chat-pop-in {
              animation: chat-pop-in 0.2s ease-out forwards;
          }
          @keyframes typing-bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1.0); }
          }
          .typing-dot {
              display: inline-block;
              width: 8px;
              height: 8px;
              background-color: #9ca3af; /* gray-400 */
              border-radius: 50%;
              animation: typing-bounce 1.4s infinite ease-in-out both;
          }
      `}</style>
    </>
  );
};

export default AIAssistant;