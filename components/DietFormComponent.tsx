import React, { useState, useEffect } from 'react';
import { UserProfile, DietaryGoal } from '../types';
import { DIETARY_GOALS } from '../constants';

interface DietFormComponentProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const DietFormComponent: React.FC<DietFormComponentProps> = ({ onSubmit, isLoading }) => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [goal, setGoal] = useState<DietaryGoal>(DietaryGoal.LOSE_WEIGHT);
  const [bmi, setBmi] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      const calculatedBmi = weightNum / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    } else {
      setBmi(null);
    }
  }, [weight, height]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!age || +age <= 0 || +age > 120) newErrors.age = 'Enter a valid age.';
    if (!weight || +weight <= 0) newErrors.weight = 'Enter a valid weight.';
    if (!height || +height <= 0) newErrors.height = 'Enter a valid height.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && bmi) {
      onSubmit({
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        height: parseFloat(height),
        goal,
        bmi,
      });
    }
  };

  const inputStyles = `w-full bg-transparent border-b-2 py-2 px-1 text-gray-800 focus:outline-none transition-colors duration-300`;
  const errorStyles = `border-red-400 focus:border-red-500`;
  const normalStyles = `border-gray-300/70 hover:border-gray-500/80 focus:border-emerald-500`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Age</label>
          <div className="relative">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 25"
              className={`${inputStyles} ${errors.age ? errorStyles : normalStyles} pr-16`}
              min="1"
            />
            <span className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm text-gray-400 pointer-events-none">years</span>
          </div>
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Weight</label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
              className={`${inputStyles} ${errors.weight ? errorStyles : normalStyles} pr-14`}
              min="1"
            />
            <span className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm text-gray-400 pointer-events-none">kg</span>
          </div>
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Height</label>
          <div className="relative">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 175"
              className={`${inputStyles} ${errors.height ? errorStyles : normalStyles} pr-14`}
              min="1"
            />
            <span className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm text-gray-400 pointer-events-none">cm</span>
          </div>
          {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
        </div>
      </div>
      
      {bmi !== null && (
        <div className="text-center bg-emerald-500/10 p-3 rounded-lg animate-fade-in">
          <p className="text-sm font-semibold text-emerald-800">
            Your Calculated BMI: <span className="font-bold text-lg">{bmi}</span>
          </p>
        </div>
      )}

      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-gray-600 mb-1">Dietary Goal</label>
        <div className="relative group">
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as DietaryGoal)}
            className={`${inputStyles} ${normalStyles} appearance-none pr-10`}
          >
            {DIETARY_GOALS.map((g) => (
              <option key={g} value={g} className="text-gray-800 bg-white">{g}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 group-hover:text-gray-600 group-focus-within:text-emerald-500 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !bmi}
        className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-violet-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Get My Plan'
        )}
      </button>
    </form>
  );
};

export default DietFormComponent;