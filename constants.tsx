
import { AgeMilestone, ActionType, RecommendationItem } from './types';

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
    description: 'Una revisión exhaustiva de los antecedentes médicos del niño, incluyendo cambios desde la última visita, actualizaciones de salud familiar y preocupaciones de los padres sobre el comportamiento o desarrollo.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Longitud/Estatura y Peso',
    category: 'MEDIDAS',
    description: 'Medición precisa de los parámetros de crecimiento para asegurar que el niño siga una curva de crecimiento saludable. Ayuda a identificar problemas nutricionales o condiciones médicas subyacentes.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Perímetro Cefálico',
    category: 'MEDIDAS',
    description: 'Medición del tamaño de la cabeza en lactantes para monitorear el desarrollo cerebral y detectar posibles problemas como macrocefalia o microcefalia.',
    actions: createActions(['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Índice de Masa Corporal (IMC)',
    category: 'MEDIDAS',
    description: 'Cálculo basado en el peso y la estatura para detectar bajo peso, sobrepeso u obesidad, comenzando a los 2 años de edad.',
    actions: createActions(['24 meses', '30 meses', '3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '9 años', '10 años', '11 años', '12 años', '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'], ActionType.PERFORM)
  },
  {
    name: 'Presión Arterial',
    category: 'MEDIDAS',
    description: 'Tamizaje de hipertensión. Se realiza de forma rutinaria a partir de los 3 años, o antes si existen factores de riesgo específicos.',
    actions: {
      ...createActions(['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses'], ActionType.RISK_ASSESSMENT),
      ...createActions(['3 años', '4 años', '5 años', '6 años', '7 años', '8 años', '9 años', '10 años', '11 años', '12 años', '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Visión',
    category: 'TAMIZAJE SENSORIAL',
    description: 'Evaluación de la agudeza visual y alineación ocular. La detección temprana de problemas como la ambliopía u "ojo perezoso" es crucial para el desarrollo visual normal.',
    actions: {
      ...createActions(['Recién nacido', '3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses'], ActionType.RISK_ASSESSMENT),
      ...createActions(['3 años', '4 años', '5 años', '6 años', '8 años', '10 años', '12 años', '15 años'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Audición',
    category: 'TAMIZAJE SENSORIAL',
    description: 'Evaluación de la capacidad auditiva en diferentes frecuencias. Los recién nacidos son evaluados al nacer y los niños mayores reciben audiometrías formales periódicas.',
    actions: {
      ...createActions(['Recién nacido'], ActionType.PERFORM),
      ...createActions(['3-5 días', '1 mes', '2 meses', '4 meses', '6 meses', '9 meses', '12 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años'], ActionType.RISK_ASSESSMENT),
      ...createActions(['4 años', '5 años', '6 años', '8 años', '10 años'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Desarrollo',
    category: 'SALUD MENTAL',
    description: 'Uso de herramientas estandarizadas para monitorear el progreso del desarrollo en áreas como motricidad, lenguaje y comportamiento socioemocional.',
    actions: createActions(['9 meses', '18 meses', '30 meses'], ActionType.PERFORM)
  },
  {
    name: 'Trastorno del Espectro Autista',
    category: 'SALUD MENTAL',
    description: 'Herramientas de tamizaje específicas (como el M-CHAT) utilizadas para identificar signos tempranos de autismo. La intervención temprana es clave.',
    actions: createActions(['18 meses', '24 meses'], ActionType.PERFORM)
  },
  {
    name: 'Consumo de Tabaco, Alcohol o Drogas',
    category: 'SALUD MENTAL',
    description: 'Tamizaje confidencial sobre comportamientos y riesgos de consumo de sustancias. Incluye educación sobre los impactos en la salud.',
    actions: createActions(['11 años', '12 años', '13 años', '14 años', '15 años', '16 años', '17 años', '18 años', '19 años', '20 años', '21 años'], ActionType.RISK_ASSESSMENT)
  },
  {
    name: 'Examen Físico',
    category: 'EXAMEN FÍSICO',
    description: 'Evaluación física completa de pies a cabeza por el pediatra para revisar todos los sistemas de órganos y asegurar la salud física general.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Inmunizaciones',
    category: 'PROCEDIMIENTOS',
    description: 'Revisión y administración de las vacunas recomendadas según el calendario nacional para proteger contra enfermedades infecciosas graves.',
    actions: createActions(MILESTONES, ActionType.PERFORM)
  },
  {
    name: 'Tamizaje de Anemia',
    category: 'PROCEDIMIENTOS',
    description: 'Análisis de sangre o evaluación de riesgo para detectar deficiencia de hierro, que puede afectar el desarrollo cognitivo y físico.',
    actions: {
      ...createActions(['4 meses', '9 meses', '15 meses', '18 meses', '24 meses', '30 meses', '3 años'], ActionType.RISK_ASSESSMENT),
      ...createActions(['12 meses'], ActionType.PERFORM)
    }
  },
  {
    name: 'Tamizaje de Plomo',
    category: 'PROCEDIMIENTOS',
    description: 'Evaluación del riesgo de exposición al plomo, el cual es tóxico para el cerebro en desarrollo; niños de alto riesgo pueden requerir análisis de sangre.',
    actions: {
      ...createActions(['9 meses', '18 meses', '30 meses'], ActionType.RISK_ASSESSMENT),
      ...createActions(['12 meses', '24 meses'], ActionType.PERFORM)
    }
  },
  {
    name: 'Salud Bucal / Hogar Dental',
    category: 'SALUD BUCAL',
    description: 'Evaluación de la higiene y desarrollo dental. Se anima a las familias a establecer un "hogar dental" para revisiones regulares desde los 12 meses.',
    actions: createActions(['12 meses', '18 meses', '24 meses', '30 meses', '3 años', '6 años'], ActionType.PERFORM)
  },
  {
    name: 'Displasia Cervical',
    category: 'PROCEDIMIENTOS',
    genderSpecific: 'female',
    description: 'Tamizaje de células anormales en el cuello uterino (Papanicolaou) para prevenir el cáncer cervical, comenzando a los 21 años.',
    actions: createActions(['21 años'], ActionType.PERFORM)
  }
];
