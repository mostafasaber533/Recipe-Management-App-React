import React, { createContext, useContext, ReactNode } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { useShoppingList } from '../hooks/useShoppingList';
import { useMealPlan } from '../hooks/useMealPlan';

// Create context
interface AppContextType {
  recipes: ReturnType<typeof useRecipes>;
  shoppingList: ReturnType<typeof useShoppingList>;
  mealPlan: ReturnType<typeof useMealPlan>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const recipes = useRecipes();
  const shoppingList = useShoppingList();
  const mealPlan = useMealPlan();

  return (
    <AppContext.Provider value={{ recipes, shoppingList, mealPlan }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};