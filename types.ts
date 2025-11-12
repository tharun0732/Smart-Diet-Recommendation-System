export enum DietaryGoal {
  LOSE_WEIGHT = 'Lose Weight',
  MAINTAIN_WEIGHT = 'Maintain Weight',
  GAIN_WEIGHT = 'Gain Weight',
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: DietaryGoal;
  bmi: number;
}

export interface DietRecommendation {
  planTitle: string;
  details: string[];
  bmi: number;
  bmiCategory: string;
}