import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function GeminiDemo() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<{ question: string; answer: string } | null>(null);
  
  const [studentAnswer, setStudentAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  const { t, language } = useLanguage();

  const generateQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    setQuiz(null);
    setGradeResult(null);
    setStudentAnswer('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = language === 'ar' 
        ? `قم بإنشاء سؤال اختبار قصير ومباشر حول الموضوع: "${topic}". قدم أيضًا الإجابة المتوقعة القصيرة.`
        : `Génère une question de quiz courte et directe sur le sujet : "${topic}". Fournis également la réponse attendue courte.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "La question du quiz" },
              answer: { type: Type.STRING, description: "La réponse attendue" }
            },
            required: ["question", "answer"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setQuiz(result);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const gradeAnswer = async () => {
    if (!studentAnswer || !quiz) return;
    setGrading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = language === 'ar'
        ? `قم بتقييم إجابة الطالب على السؤال التالي.
        السؤال: ${quiz.question}
        الإجابة المتوقعة: ${quiz.answer}
        إجابة الطالب: ${studentAnswer}
        
        حدد ما إذا كانت إجابة الطالب صحيحة (حتى لو تمت صياغتها بشكل مختلف أو تحتوي على أخطاء إملائية طفيفة) وقدم ملاحظات قصيرة (جملة واحدة).`
        : `Évalue la réponse de l'élève à la question suivante.
        Question: ${quiz.question}
        Réponse attendue: ${quiz.answer}
        Réponse de l'élève: ${studentAnswer}
        
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
      setGradeResult(result);
    } catch (error) {
      console.error("Error grading answer:", error);
    } finally {
      setGrading(false);
    }
  };

  return (
    <section id="demo" className="py-16 bg-indigo-50 border-y border-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t('demo.title')}</h2>
          <p className="mt-4 text-slate-600">
            {t('demo.desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('demo.placeholder')}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                onKeyDown={(e) => e.key === 'Enter' && generateQuiz()}
              />
              <button
                onClick={generateQuiz}
                disabled={loading || !topic}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {t('demo.generateBtn')}
              </button>
            </div>

            {quiz && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">{t('demo.aiQuestion')}</h3>
                  <p className="text-lg font-medium text-slate-900 mb-4">{quiz.question}</p>
                  <p className="text-sm text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-md border border-emerald-200">
                    {t('demo.expectedAns')} {quiz.answer}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">{t('demo.simTitle')}</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      placeholder={t('demo.simPlaceholder')}
                      className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      onKeyDown={(e) => e.key === 'Enter' && gradeAnswer()}
                    />
                    <button
                      onClick={gradeAnswer}
                      disabled={grading || !studentAnswer}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
                    >
                      {grading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      {t('demo.sendEvalBtn')}
                    </button>
                  </div>
                </div>

                {gradeResult && (
                  <div className={`p-4 rounded-xl border flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300 ${
                    gradeResult.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    {gradeResult.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-bold ${gradeResult.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {gradeResult.isCorrect ? t('demo.ansCorrect') : t('demo.ansIncorrect')}
                      </h4>
                      <p className={`text-sm mt-1 ${gradeResult.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {gradeResult.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
