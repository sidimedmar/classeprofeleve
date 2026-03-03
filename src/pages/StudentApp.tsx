import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../lib/socket';
import { Send, Phone, Video, MoreVertical, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'announcement' | 'quiz' | 'response' | 'chat';
  classId: string;
};

export default function StudentApp() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [studentName, setStudentName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const classId = 'c1'; // Hardcoded for demo
  const professorName = 'Prof. Dupont';

  useEffect(() => {
    if (!hasJoined) return;

    socket.connect();
    
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { name: studentName, role: 'student', classId });
    });

    socket.on('state', (state: { messages: Message[] }) => {
      setMessages(state.messages);
    });

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
      if (message.senderId !== socket.id) {
        toast.success(`Nouveau message de ${message.senderName}`, {
          icon: '📱',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('state');
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [hasJoined, studentName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socket.emit('sendMessage', {
      text: inputText,
      type: 'response',
      classId
    });
    setInputText('');
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Rejoindre la classe</h1>
          <p className="text-center text-slate-500 mb-8">Entrez votre prénom pour simuler l'application WhatsApp de l'élève.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); if (studentName.trim()) setHasJoined(true); }}>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Votre prénom (ex: Ali)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition mb-4"
              required
            />
            <button
              type="submit"
              disabled={!studentName.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              Commencer la simulation
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 transition">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5ddd5] flex items-center justify-center p-4 font-sans">
      {/* Mobile Phone Mockup */}
      <div className="w-full max-w-md h-[800px] max-h-[90vh] bg-[#efeae2] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border-[8px] border-slate-900 relative">
        
        {/* WhatsApp Header */}
        <header className="bg-[#008069] text-white p-3 flex items-center gap-3 z-10">
          <Link to="/" className="text-white/80 hover:text-white transition">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            {professorName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base truncate">{professorName}</h2>
            <p className="text-xs text-white/80 truncate">{connected ? 'en ligne' : 'connexion...'}</p>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
          <div className="bg-[#ffeecd] text-[#54421b] text-xs py-1.5 px-3 rounded-lg text-center mx-auto max-w-[85%] shadow-sm mb-6">
            Les messages et les appels sont chiffrés de bout en bout. Personne en dehors de cette discussion ne peut les lire ou les écouter.
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === socket.id;
            const isQuiz = msg.type === 'quiz';

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-2 shadow-sm relative ${
                  isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'
                }`}>
                  {!isMe && (
                    <div className="text-[11px] font-bold text-[#008069] mb-0.5">
                      {msg.senderName}
                    </div>
                  )}
                  {isQuiz && !isMe && (
                    <div className="text-[11px] font-bold text-orange-600 mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      NOUVEAU QUIZ
                    </div>
                  )}
                  <p className="text-[14px] text-[#111b21] leading-snug whitespace-pre-wrap pr-12">
                    {msg.text}
                  </p>
                  <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">{format(msg.timestamp, 'HH:mm')}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f2f5] p-2 flex items-end gap-2 z-10">
          <div className="flex-1 bg-white rounded-2xl flex items-end min-h-[44px] shadow-sm">
            <button className="p-3 text-slate-500 hover:text-slate-700">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e as any);
                }
              }}
              placeholder="Message"
              className="flex-1 max-h-32 py-3 outline-none resize-none bg-transparent text-[15px]"
              rows={1}
            />
            <button className="p-3 text-slate-500 hover:text-slate-700">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
          </div>
          {inputText.trim() ? (
            <button 
              onClick={sendMessage}
              className="w-11 h-11 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-sm hover:bg-[#008f6f] transition shrink-0"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button className="w-11 h-11 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-sm hover:bg-[#008f6f] transition shrink-0">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
