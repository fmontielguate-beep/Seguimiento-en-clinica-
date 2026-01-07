
import React, { useState, useMemo } from 'react';
import { PERIODICITY_DATA, MILESTONES } from './constants.tsx';
import { Gender, AgeMilestone, ActionType, RecommendationItem } from './types.ts';

// Componentes de ayuda
const Badge: React.FC<{ type: ActionType }> = ({ type }) => {
  if (type === ActionType.PERFORM) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider border border-emerald-200">
        Mandatorio
      </span>
    );
  }
  if (type === ActionType.RISK_ASSESSMENT) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider border border-amber-200">
        Evaluar Riesgo
      </span>
    );
  }
  return null;
};

const Modal: React.FC<{ item: RecommendationItem; action: ActionType; onClose: () => void }> = ({ item, action, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">{item.category}</p>
            <h3 className="font-black text-slate-900 text-2xl leading-tight">{item.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo:</span>
             <Badge type={action} />
          </div>
          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
            <h4 className="text-xs font-black text-indigo-900 mb-3 uppercase tracking-widest">Guía Preventiva AAP</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              {item.description || "Esta acción es fundamental para asegurar el desarrollo óptimo y la detección temprana de patologías según la edad del paciente."}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
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

    if (birthDate > today) return { error: 'Fecha inválida.' };

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
    const { totalDays, totalMonths } = ageData;

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

    const roundedYears = Math.round(totalMonths / 12);
    const clampedYears = Math.max(3, Math.min(21, roundedYears));
    return `${clampedYears} años` as AgeMilestone;
    
  }, [ageData]);

  const recommendationsByVisit = useMemo(() => {
    if (!currentMilestone) return [];
    return PERIODICITY_DATA.filter(item => {
      if (item.genderSpecific && item.genderSpecific !== sex) return false;
      return item.actions[currentMilestone] !== ActionType.NONE;
    });
  }, [currentMilestone, sex]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white/90 border-b border-slate-200 sticky top-0 z-20 backdrop-blur-xl shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-3 rounded-[1.2rem] shadow-xl shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">PediaCheck</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5">Guía de Periodicidad AAP</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="date" 
              className="px-5 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
              <button 
                onClick={() => setSex('male')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${sex === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Niño
              </button>
              <button 
                onClick={() => setSex('female')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${sex === 'female' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
              >
                Niña
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        {!ageData ? (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-20 text-center shadow-2xl shadow-slate-200/40 border-b-8 border-b-indigo-500">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Tu Bitácora de Salud</h2>
            <p className="text-slate-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
              Ingresa la fecha de nacimiento para visualizar el protocolo completo de tamizajes, medidas y consejos preventivos.
            </p>
          </div>
        ) : 'error' in ageData ? (
          <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-10 text-center text-rose-800 font-black shadow-lg">
            Error: {ageData.error}
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Tarjeta de Resumen de Edad */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                  <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.3em] mb-3">Edad del Paciente</p>
                  <div className="flex items-baseline gap-4">
                    <p className="text-6xl font-black tracking-tighter">
                      {ageData.years > 0 ? ageData.years : ageData.months > 0 ? ageData.months : ageData.days}
                    </p>
                    <p className="text-2xl font-bold text-indigo-100">
                      {ageData.years > 0 ? (ageData.years === 1 ? 'Año' : 'Años') : ageData.months > 0 ? (ageData.months === 1 ? 'Mes' : 'Meses') : 'Días'}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm font-bold text-indigo-100/80">
                    {ageData.years > 0 && ageData.months > 0 && <span>+ {ageData.months} meses</span>}
                    {ageData.months > 0 && ageData.days > 0 && <span>+ {ageData.days} días</span>}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 text-center min-w-[240px]">
                  <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Bloque de Periodicidad</p>
                  <p className="text-2xl font-black text-white">{currentMilestone}</p>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
            </div>

            {/* Lista de Acciones */}
            <div className="grid gap-8">
              <div className="flex items-center gap-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight shrink-0">Acciones de la Consulta</h3>
                <div className="h-0.5 flex-1 bg-slate-200 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Checklist Clínico</span>
              </div>

              {Object.entries(
                recommendationsByVisit.reduce((acc, curr) => {
                  if (!acc[curr.category]) acc[curr.category] = [];
                  acc[curr.category].push(curr);
                  return acc;
                }, {} as Record<string, RecommendationItem[]>)
              ).map(([category, items]) => (
                <section key={category} className="space-y-4">
                  <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {category}
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <ul className="divide-y divide-slate-50">
                      {(items as RecommendationItem[]).map((item, idx) => {
                        const action = item.actions[currentMilestone!];
                        return (
                          <li 
                            key={idx} 
                            onClick={() => setSelectedItem({ item, action })}
                            className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 cursor-pointer group transition-all gap-3"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-slate-800 font-black text-base group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 line-clamp-1">{item.description}</p>
                              </div>
                            </div>
                            <Badge type={action} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>
              ))}
            </div>

            {/* Disclaimer Legal/Médico */}
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex gap-6 items-start">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-amber-900 text-sm uppercase tracking-widest">Información Importante</h5>
                <p className="text-xs text-amber-800/80 leading-relaxed font-bold">
                  Esta aplicación se basa en las recomendaciones de **Bright Futures (AAP)**. El tamizaje de plomo, anemia y VIH debe ajustarse según los factores de riesgo locales y el criterio del pediatra. Algunos tamizajes como la displasia cervical (Papanicolau) o la evaluación de salud sexual son sensibles al sexo biológico y comportamiento individual.
                </p>
              </div>
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
