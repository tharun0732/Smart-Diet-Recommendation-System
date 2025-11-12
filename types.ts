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

// New types for the chatbot to avoid @google/genai dependency on frontend
export interface Part {
  text: string;
}

export interface Content {
  role: 'user' | 'model';
  parts: Part[];
}
