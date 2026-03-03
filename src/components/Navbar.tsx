import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-indigo-600">LiveClass WhatsApp</Link>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">Concept</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <a href="/#concept" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.concept')}</a>
            <a href="/#demo" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.demo')}</a>
            <a href="/#workflow" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.workflow')}</a>
            <a href="/#architecture" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.architecture')}</a>
            <a href="/#analytics" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.analytics')}</a>
            <Link to="/guide" className="text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('nav.guide')}</Link>
            
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="ml-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-bold transition-colors border border-slate-300"
            >
              {language === 'fr' ? 'عربي' : 'FR'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
