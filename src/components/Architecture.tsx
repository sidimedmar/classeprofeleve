import { useLanguage } from '../contexts/LanguageContext';

export default function Architecture() {
  const { t } = useLanguage();

  return (
    <section id="architecture" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{t('architecture.title')}</h2>
          <p className="mt-4 text-slate-600">
            {t('architecture.desc')}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">⚛️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('architecture.frontTitle')}</h3>
            <p className="text-sm font-semibold text-indigo-600 mb-3">{t('architecture.frontSub')}</p>
            <p className="text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {t('architecture.frontDesc')}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 hidden group-hover:block border-t border-slate-200 pt-2">
              <li>• {t('architecture.frontL1')}</li>
              <li>• {t('architecture.frontL2')}</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-green-600 font-bold text-xl">⚙️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('architecture.backTitle')}</h3>
            <p className="text-sm font-semibold text-green-600 mb-3">{t('architecture.backSub')}</p>
            <p className="text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {t('architecture.backDesc')}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 hidden group-hover:block border-t border-slate-200 pt-2">
              <li>• {t('architecture.backL1')}</li>
              <li>• {t('architecture.backL2')}</li>
              <li>• {t('architecture.backL3')}</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-orange-600 font-bold text-xl">🔥</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('architecture.dbTitle')}</h3>
            <p className="text-sm font-semibold text-orange-600 mb-3">{t('architecture.dbSub')}</p>
            <p className="text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {t('architecture.dbDesc')}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 hidden group-hover:block border-t border-slate-200 pt-2">
              <li>• {t('architecture.dbL1')}</li>
              <li>• {t('architecture.dbL2')}</li>
              <li>• {t('architecture.dbL3')}</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg cursor-default">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600 font-bold text-xl">💬</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('architecture.msgTitle')}</h3>
            <p className="text-sm font-semibold text-blue-600 mb-3">{t('architecture.msgSub')}</p>
            <p className="text-slate-600 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
              {t('architecture.msgDesc')}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500 hidden group-hover:block border-t border-slate-200 pt-2">
              <li>• {t('architecture.msgL1')}</li>
              <li>• {t('architecture.msgL2')}</li>
              <li>• {t('architecture.msgL3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
