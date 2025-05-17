import { Recipe, ShoppingList, MealPlan } from '../types';
import { sampleRecipes, sampleShoppingLists, sampleMealPlans } from './sampleData';

// Local storage keys
const RECIPES_KEY = 'recipeManager_recipes';
const SHOPPING_LISTS_KEY = 'recipeManager_shoppingLists';
const MEAL_PLANS_KEY = 'recipeManager_mealPlans';

// Initialize with sample data if storage is empty
const initializeStorage = () => {
  if (!localStorage.getItem(RECIPES_KEY)) {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(sampleRecipes));
  }
  
  if (!localStorage.getItem(SHOPPING_LISTS_KEY)) {
    localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(sampleShoppingLists));
  }
  
  if (!localStorage.getItem(MEAL_PLANS_KEY)) {
    localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(sampleMealPlans));
  }
};

// Recipe Storage
export const getRecipes = (): Recipe[] => {
  initializeStorage();
  const recipes = localStorage.getItem(RECIPES_KEY);
  return recipes ? JSON.parse(recipes) : [];
};

export const saveRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes();
  const index = recipes.findIndex(r => r.id === recipe.id);
  
  if (index !== -1) {
    recipes[index] = recipe;
  } else {
    recipes.push(recipe);
  }
  
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes().filter(recipe => recipe.id !== id);
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
};

// Shopping List Storage
export const getShoppingLists = (): ShoppingList[] => {
  initializeStorage();
  const lists = localStorage.getItem(SHOPPING_LISTS_KEY);
  return lists ? JSON.parse(lists) : [];
};

export const saveShoppingList = (list: ShoppingList): void => {
  const lists = getShoppingLists();
  const index = lists.findIndex(l => l.id === list.id);
  
  if (index !== -1) {
    lists[index] = list;
  } else {
    lists.push(list);
  }
  
  localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(lists));
};

export const deleteShoppingList = (id: string): void => {
  const lists = getShoppingLists().filter(list => list.id !== id);
  localStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(lists));
};

// Meal Plan Storage
export const getMealPlans = (): MealPlan[] => {
  initializeStorage();
  const plans = localStorage.getItem(MEAL_PLANS_KEY);
  return plans ? JSON.parse(plans) : [];
};

export const saveMealPlan = (plan: MealPlan): void => {
  const plans = getMealPlans();
  const index = plans.findIndex(p => p.id === plan.id);
  
  if (index !== -1) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
};

export const deleteMealPlan = (id: string): void => {
  const plans = getMealPlans().filter(plan => plan.id !== id);
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
};