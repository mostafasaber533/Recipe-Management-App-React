import { useState, useEffect, useCallback } from 'react';
import { MealPlan } from '../types';
import { getMealPlans, saveMealPlan, deleteMealPlan } from '../utils/storageUtils';
import { v4 as uuidv4 } from 'uuid';

export const useMealPlan = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load meal plans
  useEffect(() => {
    setMealPlans(getMealPlans());
    setIsLoading(false);
  }, []);

  // Get meal plan for a specific date
  const getMealPlanForDate = useCallback((date: string): MealPlan | undefined => {
    return mealPlans.find(plan => plan.date === date);
  }, [mealPlans]);

  // Add or update a meal plan
  const saveMealPlanForDate = useCallback((date: string, meals: MealPlan['meals']) => {
    const existingPlan = getMealPlanForDate(date);
    
    if (existingPlan) {
      // Update existing plan
      const updatedPlan = {
        ...existingPlan,
        meals: {
          ...existingPlan.meals,
          ...meals
        }
      };
      
      saveMealPlan(updatedPlan);
      setMealPlans(prev => prev.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
      return updatedPlan;
    } else {
      // Create new plan
      const newPlan: MealPlan = {
        id: uuidv4(),
        date,
        meals
      };
      
      saveMealPlan(newPlan);
      setMealPlans(prev => [...prev, newPlan]);
      return newPlan;
    }
  }, [getMealPlanForDate]);

  // Clear a meal from a date
  const clearMeal = useCallback((date: string, mealType: keyof MealPlan['meals']) => {
    const plan = getMealPlanForDate(date);
    
    if (plan) {
      const updatedMeals = { ...plan.meals };
      
      // Remove the specified meal
      if (mealType === 'snacks') {
        updatedMeals.snacks = [];
      } else {
        // @ts-ignore - TypeScript doesn't understand we're clearing the property
        updatedMeals[mealType] = undefined;
      }
      
      saveMealPlanForDate(date, updatedMeals);
    }
  }, [getMealPlanForDate, saveMealPlanForDate]);

  // Get meal plans for a date range
  const getMealPlansForRange = useCallback((startDate: string, endDate: string): MealPlan[] => {
    return mealPlans.filter(plan => plan.date >= startDate && plan.date <= endDate);
  }, [mealPlans]);

  // Generate dates for a week
  const getWeekDates = useCallback((startDate?: Date): string[] => {
    const start = startDate || new Date();
    start.setHours(0, 0, 0, 0);
    
    // Make sure we start with Monday
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    // Generate array of 7 days starting from Monday
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }, []);

  return {
    mealPlans,
    isLoading,
    getMealPlanForDate,
    saveMealPlanForDate,
    clearMeal,
    getMealPlansForRange,
    getWeekDates
  };
};