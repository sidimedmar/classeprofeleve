import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-semibold text-lg text-white mb-2">{t('footer.title')}</p>
        <p className="text-sm opacity-70">{t('footer.desc')}</p>
        <div className="mt-8 pt-8 border-t border-slate-800 text-xs">
          {t('footer.copy')}
        </div>
      </div>
    </footer>
  );
}
