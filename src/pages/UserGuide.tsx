import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function UserGuide() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="flex-1 bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-12 text-center">
            {t('guide.title')}
          </h1>

          <div className="space-y-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
                <span className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">👨‍🏫</span>
                {t('guide.profTitle')}
              </h2>
              <ul className="space-y-4 text-slate-600 list-disc list-inside">
                <li>{t('guide.prof1')}</li>
                <li>{t('guide.prof2')}</li>
                <li>{t('guide.prof3')}</li>
                <li>{t('guide.prof4')}</li>
                <li>{t('guide.prof5')}</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-3">
                <span className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">📱</span>
                {t('guide.studentTitle')}
              </h2>
              <ul className="space-y-4 text-slate-600 list-disc list-inside">
                <li>{t('guide.student1')}</li>
                <li>{t('guide.student2')}</li>
                <li>{t('guide.student3')}</li>
                <li>{t('guide.student4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
