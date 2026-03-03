import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../lib/socket';
import { Users, MessageSquare, Send, Bell, BarChart3, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { GoogleGenAI, Type } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'announcement' | 'quiz' | 'response' | 'chat';
  classId: string;
};

type User = { id: string; name: string; role: 'professor' | 'student'; classId?: string };

export default function ProfessorDashboard() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [inputText, setInputText] = useState('');
  const [msgType, setMsgType] = useState<'announcement' | 'quiz'>('announcement');
  const [isGrading, setIsGrading] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, { isCorrect: boolean; feedback: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { t, language } = useLanguage();

  const classId = 'c1'; // Hardcoded for demo
  const professorName = language === 'ar' ? 'أ. دوبون' : 'Prof. Dupont';

  useEffect(() => {
    socket.connect();
    
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { name: professorName, role: 'professor', classId });
    });

    socket.on('state', (state: { messages: Message[], users: User[] }) => {
      setMessages(state.messages);
      setStudents(state.users.filter(u => u.role === 'student'));
    });

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
      if (message.type === 'response' || message.type === 'chat') {
        toast.success(language === 'ar' ? `رسالة جديدة من ${message.senderName}` : `Nouveau message de ${message.senderName}`);
      }
    });

    socket.on('userJoined', (user: User) => {
      if (user.role === 'student') {
        setStudents(prev => {
          if (prev.find(u => u.id === user.id)) return prev;
          return [...prev, user];
        });
        toast(language === 'ar' ? `انضم الطالب ${user.name} إلى الفصل.` : `L'élève ${user.name} a rejoint la classe.`, { icon: '👋' });
      }
    });

    socket.on('userLeft', (userId: string) => {
      setStudents(prev => prev.filter(u => u.id !== userId));
    });

    return () => {
      socket.off('connect');
      socket.off('state');
      socket.off('newMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.disconnect();
    };
  }, [professorName, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socket.emit('sendMessage', {
      text: inputText,
      type: msgType,
      classId
    });
    setInputText('');
  };

  const gradeResponse = async (message: Message) => {
    // Find the last quiz question sent before this response
    const quizMessages = messages.filter(m => m.type === 'quiz' && m.timestamp < message.timestamp);
    const lastQuiz = quizMessages[quizMessages.length - 1];
    
    if (!lastQuiz) {
      toast.error(language === 'ar' ? "تعذر العثور على السؤال المطابق." : "Impossible de trouver la question correspondante.");
      return;
    }

    setIsGrading(prev => ({ ...prev, [message.id]: true }));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = language === 'ar'
        ? `قم بتقييم إجابة الطالب على السؤال التالي.
        السؤال: ${lastQuiz.text}
        إجابة الطالب: ${message.text}
        
        حدد ما إذا كانت إجابة الطالب صحيحة (حتى لو تمت صياغتها بشكل مختلف أو تحتوي على أخطاء إملائية طفيفة) وقدم ملاحظات قصيرة (جملة واحدة).`
        : `Évalue la réponse de l'élève à la question suivante.
        Question: ${lastQuiz.text}
        Réponse de l'élève: ${message.text}
        
        Détermine si la réponse de l'élève est correcte (même si elle est formulée différemment ou contient des fautes d'orthographe mineures) et donne un court feedback (1 phrase).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN, description: "True si la réponse est correcte ou très proche" },
              feedback: { type: Type.STRING, description: "Court feedback pour l'élève" }
            },
            required: ["isCorrect", "feedback"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setGrades(prev => ({ ...prev, [message.id]: result }));
      toast.success(language === 'ar' ? "اكتمل التقييم!" : "Évaluation terminée !");
    } catch (error) {
      console.error("Error grading answer:", error);
      toast.error(language === 'ar' ? "خطأ أثناء التقييم." : "Erreur lors de l'évaluation.");
    } finally {
      setIsGrading(prev => ({ ...prev, [message.id]: false }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            LiveClass
          </h1>
          <p className="text-xs text-slate-500 mt-1">{t('prof.title')}</p>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('prof.activeClass')}</h2>
            <div className="bg-indigo-600/20 text-indigo-400 px-4 py-3 rounded-lg border border-indigo-500/30 flex items-center justify-between">
              <span className="font-medium">Math 101</span>
              <span className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {connected ? t('prof.online') : t('prof.offline')}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              {t('prof.connectedStudents')}
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">{students.length}</span>
            </h2>
            <ul className="space-y-2">
              {students.length === 0 ? (
                <li className="text-sm text-slate-600 italic">{t('prof.noStudents')}</li>
              ) : (
                students.map(student => (
                  <li key={student.id} className="flex items-center gap-2 text-sm bg-slate-800/50 px-3 py-2 rounded-md">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    {student.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
            <LogOut className="w-4 h-4" />
            {t('prof.leave')}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">{t('prof.session')} Math 101</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                P
              </div>
              <span className="text-sm font-medium text-slate-700">{professorName}</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p>{t('prof.noMessages')}</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isProf = msg.senderId === socket.id || msg.senderName === professorName;
              const isQuiz = msg.type === 'quiz';
              const isResponse = msg.type === 'response';
              const grade = grades[msg.id];

              return (
                <div key={msg.id} className={`flex flex-col ${isProf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">{format(msg.timestamp, 'HH:mm')}</span>
                  </div>
                  <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                    isProf 
                      ? isQuiz 
                        ? 'bg-indigo-600 text-white rounded-tr-none rtl:rounded-tl-none rtl:rounded-tr-2xl' 
                        : 'bg-slate-800 text-white rounded-tr-none rtl:rounded-tl-none rtl:rounded-tr-2xl'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl'
                  }`}>
                    {isQuiz && <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">{t('prof.quizQ')}</div>}
                    {msg.type === 'announcement' && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('prof.announcement')}</div>}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  {/* Grading UI for student responses */}
                  {isResponse && !isProf && (
                    <div className="mt-2 ml-2 rtl:ml-0 rtl:mr-2">
                      {!grade ? (
                        <button 
                          onClick={() => gradeResponse(msg)}
                          disabled={isGrading[msg.id]}
                          className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1 border border-indigo-200"
                        >
                          {isGrading[msg.id] ? t('prof.evaluating') : t('prof.evalAI')}
                        </button>
                      ) : (
                        <div className={`text-xs p-2 rounded-md border flex items-start gap-2 max-w-sm ${
                          grade.isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          {grade.isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />}
                          <div>
                            <span className="font-bold block">{grade.isCorrect ? t('prof.correct') : t('prof.incorrect')}</span>
                            <span className="opacity-90">{grade.feedback}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMsgType('announcement')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  msgType === 'announcement' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('prof.announcement')}
              </button>
              <button
                type="button"
                onClick={() => setMsgType('quiz')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  msgType === 'quiz' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('prof.quizQ')}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={msgType === 'quiz' ? t('prof.askPlaceholder') : t('prof.annPlaceholder')}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-slate-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || !connected}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition flex items-center gap-2 rtl:flex-row-reverse ${
                  !inputText.trim() || !connected ? 'bg-slate-300 cursor-not-allowed' : msgType === 'quiz' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                <Send className="w-5 h-5 rtl:rotate-180" />
                <span className="hidden sm:inline">{t('prof.send')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
