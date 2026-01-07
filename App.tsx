
import React, { useState, useMemo } from 'react';
import { PERIODICITY_DATA, MILESTONES } from './constants';
import { Gender, AgeMilestone, ActionType, AgeCalculation, RecommendationItem } from './types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
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
            <h4 className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-tight">¿En qué consiste esta evaluación?</h4>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {item.description || "No hay una descripción detallada disponible para este elemento."}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
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

    if (birthDate > today) return { error: 'La fecha de nacimiento no puede ser en el futuro.' };

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
    const diffTime = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, totalMonths, totalDays };
  }, [dob]);

  const currentMilestone = useMemo((): AgeMilestone | null => {
    if (!ageData || 'error' in ageData) return null;
    const { totalDays, totalMonths, years } = ageData;

    // 1. Recién nacido y primeros días
    if (totalDays < 3) return 'Recién nacido';
    if (totalDays < 8) return '3-5 días';

    // 2. Lógica para lactantes (Usar hito inferior/previo según solicitud)
    if (totalMonths < 2) return '1 mes';
    if (totalMonths < 4) return '2 meses'; // Ejemplo: 3 meses -> Control de los 2 meses
    if (totalMonths < 6) return '4 meses';
    if (totalMonths < 9) return '6 meses';
    if (totalMonths < 12) return '9 meses';
    if (totalMonths < 15) return '12 meses';
    if (totalMonths < 18) return '15 meses';
    if (totalMonths < 24) return '18 meses';
    if (totalMonths < 30) return '24 meses';
    if (totalMonths < 36) return '30 meses';

    // 3. Niños mayores (Redondear al año más cercano según solicitud)
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
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Fecha de Nacimiento</label>
              <input 
                type="date" 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Sexo</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
            <div className="mb-4 text-slate-300 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Guías de Salud</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Ingresa los datos para ver las recomendaciones del cronograma de periodicidad de la AAP.
            </p>
          </div>
        ) : 'error' in ageData ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-800 shadow-sm">
            <p className="font-bold">{ageData.error}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Edad Actual Exacta</p>
                  <p className="text-3xl font-bold">
                    {ageData.years > 0 && `${ageData.years} ${ageData.years === 1 ? 'año' : 'años'} `}
                    {ageData.months > 0 && `${ageData.months} ${ageData.months === 1 ? 'mes' : 'meses'} `}
                    {ageData.days > 0 && `${ageData.days} ${ageData.days === 1 ? 'día' : 'días'}`}
                    {ageData.years === 0 && ageData.months === 0 && ageData.days === 0 && 'Recién nacido'}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">Edad cronológica: {ageData.totalMonths} meses ({ageData.totalDays} días)</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Hito de Control AAP</p>
                  <p className="text-xl font-semibold">{currentMilestone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800">Evaluaciones para: {currentMilestone}</h3>
                <span className="text-xs text-slate-400 font-bold uppercase">Pulsa para ver detalles</span>
              </div>
              
              {Object.entries(
                recommendationsForVisit.reduce((acc, curr) => {
                  if (!acc[curr.category]) acc[curr.category] = [];
                  acc[curr.category].push(curr);
                  return acc;
                }, {} as Record<string, RecommendationItem[]>)
              ).map(([category, items]) => (
                <section key={category} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category}</h4>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {(items as RecommendationItem[]).map((item, idx) => {
                      const action = item.actions[currentMilestone!];
                      return (
                        <li 
                          key={idx} 
                          onClick={() => setSelectedItem({ item, action })}
                          className="px-4 py-3 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer group transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-medium group-hover:text-blue-700">{item.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <Badge type={action} />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
            
            <footer className="bg-slate-100 rounded-xl p-4 text-[10px] text-slate-400 leading-relaxed italic border border-slate-200">
              Aviso legal: Esta herramienta asigna el hito inferior más cercano para lactantes y redondea al año más cercano para mayores de 3 años, facilitando el seguimiento de los controles de la AAP.
            </footer>
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
