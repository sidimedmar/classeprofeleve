import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Workflow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      title: t('workflow.step1Title'),
      desc: t('workflow.step1Desc'),
      icon: "📱",
      visualTitle: t('workflow.step1VisTitle'),
      visualText: t('workflow.step1VisText')
    },
    {
      title: t('workflow.step2Title'),
      desc: t('workflow.step2Desc'),
      icon: "👨‍🏫",
      visualTitle: t('workflow.step2VisTitle'),
      visualText: t('workflow.step2VisText')
    },
    {
      title: t('workflow.step3Title'),
      desc: t('workflow.step3Desc'),
      icon: "☁️",
      visualTitle: t('workflow.step3VisTitle'),
      visualText: t('workflow.step3VisText')
    },
    {
      title: t('workflow.step4Title'),
      desc: t('workflow.step4Desc'),
      icon: "💬",
      visualTitle: t('workflow.step4VisTitle'),
      visualText: t('workflow.step4VisText')
    },
    {
      title: t('workflow.step5Title'),
      desc: t('workflow.step5Desc'),
      icon: "✨",
      visualTitle: t('workflow.step5VisTitle'),
      visualText: t('workflow.step5VisText')
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  return (
    <section id="workflow" className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{t('workflow.title')}</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t('workflow.desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`p-4 text-sm font-semibold text-center border-b-2 transition focus:outline-none ${
                  currentStep === index
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                    : 'border-transparent hover:bg-slate-100 text-slate-500'
                }`}
              >
                {index + 1}. {step.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-indigo-700">{steps[currentStep].title}</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {steps[currentStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`visual-${currentStep}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-100 rounded-xl p-6 flex items-center justify-center border border-slate-200 h-full"
              >
                <div className="text-center space-y-3">
                  <div className="text-6xl">{steps[currentStep].icon}</div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-left mx-auto max-w-[250px] border border-slate-200">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{steps[currentStep].visualTitle}</p>
                    <p className="text-sm font-medium text-slate-800">{steps[currentStep].visualText}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm text-slate-500 font-mono">
              {t('workflow.stepXofY').replace('{current}', String(currentStep + 1)).replace('{total}', String(steps.length))}
            </span>
            <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md rtl:flex-row-reverse rtl:flex rtl:gap-2">
              {t('workflow.nextStep')} &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
