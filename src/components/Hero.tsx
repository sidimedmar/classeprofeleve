import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="concept" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            {t('hero.title1')} <span className="text-indigo-600">{t('hero.title2')}</span> {t('hero.title3')}
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {t('hero.desc')}
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/professor" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t('hero.profBtn')}
            </Link>
            <Link to="/student" className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#128C7E] transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              {t('hero.studentBtn')}
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollToSection('workflow')} className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
              {t('hero.exploreBtn')}
            </button>
            <button onClick={() => scrollToSection('architecture')} className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
              {t('hero.stackBtn')}
            </button>
          </div>
        </div>
        <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-xs border border-slate-200">
                <p className="text-xs font-bold text-indigo-600 mb-1">{t('hero.profName')}</p>
                <p className="text-sm">{t('hero.q1')}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-green-100 p-3 rounded-lg rounded-tr-none shadow-sm max-w-xs border border-green-200 relative">
                <p className="text-sm">{t('hero.ans1')}</p>
                <span className="text-[10px] text-green-700 block text-right mt-1">✓✓ {t('hero.read')}</span>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-xs border border-slate-200">
                <p className="text-xs font-bold text-indigo-600 mb-1">{t('hero.botName')}</p>
                <p className="text-sm">{t('hero.correct')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
