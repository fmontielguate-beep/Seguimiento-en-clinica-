
export type Gender = 'male' | 'female';

export enum ActionType {
  PERFORM = 'PERFORM', // Acción obligatoria (punto en la tabla)
  RISK_ASSESSMENT = 'RISK', // Evaluación de riesgo (asterisco en la tabla)
  RANGE = 'RANGE', // Rango de edad recomendado
  NONE = ''
}

export type AgeMilestone = 
  | 'Recién nacido' | '3-5 días' | '1 mes' | '2 meses' | '4 meses' | '6 meses' | '9 meses' 
  | '12 meses' | '15 meses' | '18 meses' | '24 meses' | '30 meses' | '3 años' | '4 años' 
  | '5 años' | '6 años' | '7 años' | '8 años' | '9 años' | '10 años' | '11 años' | '12 años' 
  | '13 años' | '14 años' | '15 años' | '16 años' | '17 años' | '18 años' | '19 años' | '20 años' | '21 años';

export interface RecommendationItem {
  name: string;
  category: string;
  description?: string;
  actions: Record<AgeMilestone, ActionType>;
  genderSpecific?: Gender;
}

export interface AgeCalculation {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
}
