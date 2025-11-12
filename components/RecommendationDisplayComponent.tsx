import React from 'react';
import { DietRecommendation } from '../types';

interface RecommendationDisplayComponentProps {
  recommendation: DietRecommendation | null;
  isLoading: boolean;
  error: string | null;
}

const BMI_CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
  'Underweight': "A BMI below 18.5. Consider focusing on nutrient-dense foods to support healthy weight gain.",
  'Normal weight': "A BMI between 18.5 and 24.9. This is considered a healthy weight range for most adults.",
  'Overweight': "A BMI between 25 and 29.9. This may indicate a higher risk for certain health conditions.",
  'Obese': "A BMI of 30 or greater. This often indicates a significantly higher risk for health issues."
};


const RecommendationDisplayComponent: React.FC<RecommendationDisplayComponentProps> = ({ recommendation, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-gray-500 transition-opacity duration-300">
        <svg className="animate-spin h-10 w-10 text-cyan-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium text-gray-600">Generating your personalized plan...</p>
        <p className="text-sm">Our AI is crafting the perfect diet for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-red-500/10 rounded-lg p-4 text-center animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 font-semibold">Oops! Something went wrong.</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-gray-400 p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="font-medium text-gray-500">Your plan will appear here.</p>
        <p className="text-sm">Fill out your profile to get started.</p>
      </div>
    );
  }

  return (
    <div className="h-full animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-gray-500">Your BMI</p>
        <p className="text-3xl font-bold text-gray-800">{recommendation.bmi}
          <span className="text-lg font-semibold text-gray-600 ml-2">({recommendation.bmiCategory})</span>
        </p>
        {BMI_CATEGORY_DESCRIPTIONS[recommendation.bmiCategory] && (
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                {BMI_CATEGORY_DESCRIPTIONS[recommendation.bmiCategory]}
            </p>
        )}
      </div>
      <hr className="my-6 border-gray-200" />
      <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600 mb-6 text-center">{recommendation.planTitle}</h3>
      <ul className="list-disc list-outside space-y-3 text-gray-700 mb-8 pl-5 marker:text-emerald-500">
        {recommendation.details.map((point, index) => (
          <li key={index} className="leading-relaxed break-words">{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationDisplayComponent;