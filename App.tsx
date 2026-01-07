
import React, { useState, useMemo } from 'react';
import { PERIODICITY_DATA, MILESTONES } from './constants.tsx';
import { Gender, AgeMilestone, ActionType, RecommendationItem } from './types.ts';

// Componentes de ayuda
const Badge: React.FC<{ type: ActionType }> = ({ type }) => {
  if (type === ActionType.PERFORM) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Realizar</span>;
  }
  if (type === ActionType.RISK_ASSESSMENT) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Evaluar Riesgo</span>;
  }
  if (type === ActionType.RANGE) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Rango</span>;
  }
  return null;
};

const Modal: React.FC<{ item: RecommendationItem; action: ActionType; onClose: () => void }> = ({ item, action, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
              {item.category}
            </span>
            <Badge type={action} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-tight">Descripción</h4>
            <p className="text-slate-700 leading-relaxed text-sm">
              {item.description || "No hay una descripción detallada disponible."}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

const App: React.FC = () => {
  const [dob, setDob] = useState<string>('');
  const [sex, setSex] = useState<Gender>('male');
  const [selectedItem, setSelectedItem] = useState<{ item: RecommendationItem; action: ActionType } | null>(null);

  const ageData = useMemo(() => {
    if (!dob) return null;
    
    const [year, month, day] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) return { error: 'La fecha no puede ser futura.' };

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = (years * 12) + months;
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalMonths, totalDays };
  }, [dob]);

  const currentMilestone = useMemo((): AgeMilestone | null => {
    if (!ageData || 'error' in ageData) return null;
    const { totalDays, totalMonths, years } = ageData;

    // Lactantes: Hito inferior (ej: si tiene 3 meses, usa el de 2 meses)
    if (totalDays < 3) return 'Recién nacido';
    if (totalDays < 8) return '3-5 días';
    if (totalMonths < 2) return '1 mes';
    if (totalMonths < 4) return '2 meses';
    if (totalMonths < 6) return '4 meses';
    if (totalMonths < 9) return '6 meses';
    if (totalMonths < 12) return '9 meses';
    if (totalMonths < 15) return '12 meses';
    if (totalMonths < 18) return '15 meses';
    if (totalMonths < 24) return '18 meses';
    if (totalMonths < 30) return '24 meses';
    if (totalMonths < 36) return '30 meses';

    // Niños mayores: Redondeo al año más cercano
    const roundedYears = Math.round(totalMonths / 12);
    const clampedYears = Math.max(3, Math.min(21, roundedYears));
    return `${clampedYears} años` as AgeMilestone;
    
  }, [ageData]);

  const recommendationsForVisit = useMemo(() => {
    if (!currentMilestone) return [];
    return PERIODICITY_DATA.filter(item => {
      if (item.genderSpecific && item.genderSpecific !== sex) return false;
      return item.actions[currentMilestone] !== ActionType.NONE;
    });
  }, [currentMilestone, sex]);

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Asesor Pediátrico</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">F. Nacimiento</label>
              <input 
                type="date" 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sexo</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                value={sex}
                onChange={(e) => setSex(e.target.value as Gender)}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {!ageData ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Seguimiento Preventivo</h2>
            <p className="text-slate-500">Ingresa los datos para ver las recomendaciones oficiales de la AAP.</p>
          </div>
        ) : 'error' in ageData ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-800 shadow-sm font-bold">
            {ageData.error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase mb-1">Edad Actual</p>
                  <p className="text-3xl font-bold">
                    {ageData.years > 0 && `${ageData.years}a `}
                    {ageData.months > 0 && `${ageData.months}m `}
                    {ageData.days > 0 && `${ageData.days}d`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs font-bold uppercase mb-1">Visita Correspondiente</p>
                  <p className="text-xl font-semibold">{currentMilestone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Checklist de la Visita</h3>
              {Object.entries(
                recommendationsForVisit.reduce((acc, curr) => {
                  if (!acc[curr.category]) acc[curr.category] = [];
                  acc[curr.category].push(curr);
                  return acc;
                }, {} as Record<string, RecommendationItem[]>)
              ).map(([category, items]) => (
                <section key={category} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase">{category}</h4>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {(items as RecommendationItem[]).map((item, idx) => {
                      const action = item.actions[currentMilestone!];
                      return (
                        <li 
                          key={idx} 
                          onClick={() => setSelectedItem({ item, action })}
                          className="px-4 py-3 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <span className="text-slate-700 font-medium">{item.name}</span>
                          <Badge type={action} />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedItem && (
        <Modal 
          item={selectedItem.item} 
          action={selectedItem.action} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default App;
