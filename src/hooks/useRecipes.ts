import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types';
import { getRecipes, saveRecipe, deleteRecipe } from '../utils/storageUtils';
import { v4 as uuidv4 } from 'uuid';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes
  useEffect(() => {
    setRecipes(getRecipes());
    setIsLoading(false);
  }, []);

  // Add new recipe
  const addRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: uuidv4(),
      createdAt: Date.now()
    };
    
    saveRecipe(newRecipe);
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  }, []);

  // Update existing recipe
  const updateRecipe = useCallback((recipe: Recipe) => {
    saveRecipe(recipe);
    setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
  }, []);

  // Remove recipe
  const removeRecipe = useCallback((id: string) => {
    deleteRecipe(id);
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    setRecipes(prev => {
      const updatedRecipes = prev.map(recipe => {
        if (recipe.id === id) {
          const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
          saveRecipe(updatedRecipe);
          return updatedRecipe;
        }
        return recipe;
      });
      return updatedRecipes;
    });
  }, []);

  // Update rating
  const updateRating = useCallback((id: string, rating: number) => {
    setRecipes(prev => {
      const updatedRecipes = prev.map(recipe => {
        if (recipe.id === id) {
          const updatedRecipe = { ...recipe, rating };
          saveRecipe(updatedRecipe);
          return updatedRecipe;
        }
        return recipe;
      });
      return updatedRecipes;
    });
  }, []);

  // Get a recipe by ID
  const getRecipeById = useCallback((id: string) => {
    return recipes.find(recipe => recipe.id === id);
  }, [recipes]);

  // Filter recipes
  const filterRecipes = useCallback((filter: {
    search?: string;
    category?: string;
    cuisine?: string;
    dietary?: string;
    favorite?: boolean;
  }) => {
    return recipes.filter(recipe => {
      // Search filter
      if (filter.search && !recipe.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (filter.category && recipe.category !== filter.category) {
        return false;
      }
      
      // Cuisine filter
      if (filter.cuisine && recipe.cuisine !== filter.cuisine) {
        return false;
      }
      
      // Dietary filter
      if (filter.dietary && !recipe.dietary.includes(filter.dietary)) {
        return false;
      }
      
      // Favorite filter
      if (filter.favorite !== undefined && recipe.favorite !== filter.favorite) {
        return false;
      }
      
      return true;
    });
  }, [recipes]);

  return {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    removeRecipe,
    toggleFavorite,
    updateRating,
    getRecipeById,
    filterRecipes
  };
};