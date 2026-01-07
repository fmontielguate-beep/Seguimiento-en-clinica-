
import { AgeMilestone, ActionType, RecommendationItem } from './types.ts';

export const MILESTONES: AgeMilestone[] = [
  'Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', 
  '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años', '4 años', 
  '5 años', '6 años', '7 años', '8 años', '9 años', '10 años', '11 años', '12 años', 
  '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'
];

const createActions = (activeMilestones: AgeMilestone[], type: ActionType = ActionType.PERFORM): Record<AgeMilestone, ActionType> => {
  const actions = {} as Record<AgeMilestone, ActionType>;
  MILESTONES.forEach(m => {
    actions[m] = activeMilestones.includes(m) ? type : ActionType.NONE;
  });
  return actions;
};

export const PERIODICITY_DATA: RecommendationItem[] = [
  {
    name: 'Historia Clínica (Inicial/Intervalo)',
    category: 'HISTORIA CLÍNICA',
    description: 'Revisión exhaustiva de antecedentes y salud familiar.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Peso y Talla',
    category: 'MEDIDAS',
    description: 'Monitoreo de parámetros de crecimiento saludable.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Perímetro Cefálico',
    category: 'MEDIDAS',
    description: 'Medición en lactantes para monitorear desarrollo cerebral.',
    actions: createActions(['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Tamizaje de Desarrollo',
    category: 'SALUD MENTAL',
    description: 'Uso de herramientas estandarizadas (ej: ASQ-3).',
    actions: createActions(['9 meses', '18 meses', '30 meses'], ActionType.PERFORM)
  },
  {
    name: 'Autismo (M-CHAT)',
    category: 'SALUD MENTAL',
    description: 'Tamizaje específico para trastornos del espectro autista.',
    actions: createActions(['18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Inmunizaciones',
    category: 'PROCEDIMIENTOS',
    description: 'Revisión y administración de vacunas según calendario.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  }
];
