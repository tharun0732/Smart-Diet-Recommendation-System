import React, { useState, useCallback } from 'react';
import DietFormComponent from './DietFormComponent';
import RecommendationDisplayComponent from './RecommendationDisplayComponent';
import { getDietRecommendation } from '../services/geminiService';
import { UserProfile, DietRecommendation } from '../types';

interface PlannerPageProps {
  goToHome: () => void;
}

const PlannerPage: React.FC<PlannerPageProps> = ({ goToHome }) => {
  const [recommendation, setRecommendation] = useState<DietRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await getDietRecommendation(profile);
      setRecommendation(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get recommendation. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section id="recommender" className="container mx-auto p-4 py-16 lg:py-20 animate-fade-in">
      <div className="mb-8">
        <button 
          onClick={goToHome}
          className="flex items-center text-cyan-600 hover:text-cyan-800 transition-colors duration-300 group font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700">Create Your Custom Plan</h2>
        <p className="text-gray-600 mt-2">Enter your details below to receive your AI-powered diet recommendation.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 sticky top-28">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Your Profile</h2>
          <DietFormComponent onSubmit={handleGetRecommendation} isLoading={isLoading} />
        </div>

        <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 min-h-[500px]">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Your Personalized Plan</h2>
          <RecommendationDisplayComponent
            recommendation={recommendation}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
};

export default PlannerPage;