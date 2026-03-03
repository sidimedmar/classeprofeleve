import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

export default function Analytics() {
  const { t } = useLanguage();

  const pieData = [
    { name: t('analytics.correct'), value: 18, color: '#16a34a' },
    { name: t('analytics.incorrect'), value: 10, color: '#ef4444' },
    { name: t('analytics.noAnswer'), value: 2, color: '#cbd5e1' },
  ];

  const barData = [
    { name: '< 10s', count: 5 },
    { name: '10-30s', count: 15 },
    { name: '30-60s', count: 8 },
    { name: '> 1min', count: 2 },
  ];

  return (
    <section id="analytics" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">{t('analytics.title')}</h2>
            <p className="text-slate-600">
              {t('analytics.p1')}
            </p>
            <p className="text-slate-600">
              {t('analytics.p2')}
            </p>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-indigo-900 mb-2">{t('analytics.kpiTitle')}</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('analytics.kpi1')}</span>
                  <span className="font-bold text-green-600">92%</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('analytics.kpi2')}</span>
                  <span className="font-bold text-indigo-600">45 sec</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('analytics.kpi3')}</span>
                  <span className="font-bold text-orange-500">65%</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wide text-center">{t('analytics.chart1Title')}</h3>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 text-xs text-slate-600">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wide text-center">{t('analytics.chart2Title')}</h3>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
