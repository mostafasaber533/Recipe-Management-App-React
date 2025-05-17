export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  category: string;
  cuisine: string;
  dietary: string[];
  favorite: boolean;
  rating: number;
  createdAt: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
  recipeId?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: number;
}

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  };
}

export type CategoryType = 'category' | 'cuisine' | 'dietary';