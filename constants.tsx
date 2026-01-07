
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

// Grupos de hitos
const INFANCY: AgeMilestone[] = ['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses'];
const TODDLER: AgeMilestone[] = ['12 meses', '15 meses', '18 meses', '24 meses', '30 meses'];
const ADOLESCENCE_ALL: AgeMilestone[] = ['11 años', '12 años', '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'];

export const PERIODICITY_DATA: RecommendationItem[] = [
  // --- HISTORIA Y MEDIDAS ---
  {
    name: 'Historia Clínica (Inicial/Intervalo)',
    category: 'HISTORIA',
    description: 'Actualización de antecedentes familiares, sociales y revisión de sistemas.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Medidas Antropométricas',
    category: 'MEDIDAS',
    description: 'Peso, longitud/talla y cálculo de IMC (a partir de los 2 años).',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Perímetro Cefálico',
    category: 'MEDIDAS',
    description: 'Medición obligatoria hasta los 24 meses.',
    actions: createActions([...INFANCY, '12 meses', '15 meses', '18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Presión Arterial',
    category: 'MEDIDAS',
    description: 'Tamizaje anual a partir de los 3 años.',
    actions: createActions(['3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '9 años', '10 años', ...ADOLESCENCE_ALL], ActionType.PERFORM)
  },

  // --- SENSORIAL ---
  {
    name: 'Tamizaje de Visión',
    category: 'SENSORIAL',
    description: 'Evaluación instrumental o con tabla según la edad.',
    actions: {
      ...createActions(['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses'], ActionType.RISK_ASSESSMENT),
      ...createActions(['3 años', '4 años', '5 años', '6 años', '8 años', '10 años', '12 años', '15 años', '18 años'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Audición',
    category: 'SENSORIAL',
    description: 'Tamizaje neonatal universal y luego en hitos específicos.',
    actions: {
      ...createActions(['Recién nacido', '4 años', '5 años', '6 años', '8 años', '10 años', '12 años', '15 años', '18 años'], ActionType.PERFORM),
      ...createActions(['3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años', '7 años', '9 años', '11 años', '13 años', '14 años', '16 años', '17 años', '19 años', '20 años', '21 años'], ActionType.RISK_ASSESSMENT)
    }
  },

  // --- DESARROLLO Y SALUD MENTAL ---
  {
    name: 'Desarrollo del Comportamiento',
    category: 'DESARROLLO',
    description: 'Vigilancia continua del hitos del desarrollo.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Tamizaje de Desarrollo (Estandarizado)',
    category: 'DESARROLLO',
    description: 'Uso de herramientas como ASQ-3 o PEDS.',
    actions: createActions(['9 meses', '18 meses', '30 meses'], ActionType.PERFORM)
  },
  {
    name: 'Tamizaje de Autismo (M-CHAT-R)',
    category: 'DESARROLLO',
    description: 'Detección temprana obligatoria a los 18 y 24 meses.',
    actions: createActions(['18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Depresión Materna',
    category: 'SALUD MENTAL',
    description: 'Tamizaje a la madre para asegurar el bienestar del binomio.',
    actions: createActions(['1 mes', '2 meses', '4 meses', '6 meses'], ActionType.PERFORM)
  },
  {
    name: 'Tamizaje de Depresión (Adolescente)',
    category: 'SALUD MENTAL',
    description: 'Anual a partir de los 12 años (PHQ-2 o PHQ-9).',
    actions: createActions(['12 años', '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'], ActionType.PERFORM)
  },
  {
    name: 'Consumo de Alcohol y Drogas',
    category: 'SALUD MENTAL',
    description: 'Tamizaje anual a partir de los 11 años (CRAFFT).',
    actions: createActions(ADOLESCENCE_ALL, ActionType.PERFORM)
  },

  // --- TAMIZAJE MÉDICO ---
  {
    name: 'Anemia (Hemoglobina)',
    category: 'TAMIZAJE MÉDICO',
    description: 'Tamizaje universal a los 12 meses; riesgo en otras edades.',
    actions: {
      ...createActions(MILESTONES, ActionType.RISK_ASSESSMENT),
      ...createActions(['12 meses'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Plomo',
    category: 'TAMIZAJE MÉDICO',
    description: 'Mandatorio a los 12 y 24 meses en áreas de riesgo o para pacientes de Medicaid.',
    actions: {
      ...createActions(['6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años', '4 años', '5 años', '6 años'], ActionType.RISK_ASSESSMENT),
      ...createActions(['12 meses', '24 meses'], ActionType.PERFORM)
    }
  },
  {
    name: 'Dislipidemia (Colesterol)',
    category: 'TAMIZAJE MÉDICO',
    description: 'Tamizaje universal entre 9-11 años y 17-21 años.',
    actions: {
      ...createActions(['24 meses', '3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '12 años', '13 años', '14 años', '15 años', '16 años'], ActionType.RISK_ASSESSMENT),
      ...createActions(['9 años', '10 años', '11 años', '17 años', '18 años', '19 años', '20 años', '21 años'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tuberculosis',
    category: 'TAMIZAJE MÉDICO',
    description: 'Evaluación de riesgo en cada visita según prevalencia local.',
    actions: createActions(MILESTONES, ActionType.RISK_ASSESSMENT)
  },

  // --- SALUD SEXUAL ---
  {
    name: 'Tamizaje de VIH',
    category: 'SALUD SEXUAL',
    description: 'Al menos una vez entre los 15-18 años.',
    actions: createActions(['15 años', '16 años', '17 años', '18 años'], ActionType.PERFORM)
  },
  {
    name: 'Riesgo de ITS',
    category: 'SALUD SEXUAL',
    description: 'Evaluación anual de comportamiento y riesgo de infecciones.',
    actions: createActions(ADOLESCENCE_ALL, ActionType.PERFORM)
  },
  {
    name: 'Displasia Cervical (Papanicolau)',
    category: 'SALUD SEXUAL',
    description: 'Recomendado a los 21 años para mujeres.',
    genderSpecific: 'female',
    actions: createActions(['21 años'], ActionType.PERFORM)
  },

  // --- SALUD ORAL ---
  {
    name: 'Barniz de Flúor',
    category: 'SALUD ORAL',
    description: 'Aplicación cada 3-6 meses desde la erupción del primer diente.',
    actions: createActions(['6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años', '4 años', '5 años'], ActionType.PERFORM)
  },
  {
    name: 'Suplementación de Flúor',
    category: 'SALUD ORAL',
    description: 'Evaluar si el agua local no está fluorada.',
    actions: createActions(['6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '9 años', '10 años', ...ADOLESCENCE_ALL], ActionType.RISK_ASSESSMENT)
  },
  {
    name: 'Hogar Dental (Referencia)',
    category: 'SALUD ORAL',
    description: 'Referencia a odontopediatra a partir de los 12 meses.',
    actions: createActions(['12 meses', '18 meses', '24 meses', '30 meses', '3 años', '4 años', '5 años', '6 años'], ActionType.PERFORM)
  },

  // --- PROCEDIMIENTOS ---
  {
    name: 'Inmunizaciones',
    category: 'PROCEDIMIENTOS',
    description: 'Administración según el calendario ACIP/CDC vigente.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Tamizaje Metabólico/Hemoglobina S',
    category: 'PROCEDIMIENTOS',
    description: 'Tamizaje neonatal inicial.',
    actions: createActions(['Recién nacido'], ActionType.PERFORM)
  }
];
