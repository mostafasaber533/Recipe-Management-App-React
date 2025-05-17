import { Recipe, ShoppingList, MealPlan } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const sampleRecipes: Recipe[] = [
  {
    id: uuidv4(),
    title: 'Creamy Garlic Pasta',
    description: 'A delicious and creamy pasta dish with lots of garlic flavor.',
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { id: uuidv4(), name: 'Fettuccine pasta', amount: 8, unit: 'oz' },
      { id: uuidv4(), name: 'Butter', amount: 2, unit: 'tbsp' },
      { id: uuidv4(), name: 'Garlic cloves', amount: 4, unit: 'cloves' },
      { id: uuidv4(), name: 'Heavy cream', amount: 1, unit: 'cup' },
      { id: uuidv4(), name: 'Parmesan cheese', amount: 1, unit: 'cup' },
      { id: uuidv4(), name: 'Salt', amount: 1, unit: 'tsp' },
      { id: uuidv4(), name: 'Black pepper', amount: 0.5, unit: 'tsp' },
    ],
    instructions: [
      'Cook pasta according to package instructions.',
      'In a large skillet, melt butter over medium heat.',
      'Add minced garlic and sauté until fragrant, about 1 minute.',
      'Pour in heavy cream and bring to a simmer.',
      'Add grated Parmesan cheese and stir until melted and sauce thickens.',
      'Season with salt and pepper to taste.',
      'Add cooked pasta to the sauce and toss to coat.',
      'Serve hot with additional Parmesan cheese if desired.'
    ],
    category: 'Main Course',
    cuisine: 'Italian',
    dietary: ['Vegetarian'],
    favorite: true,
    rating: 4,
    createdAt: Date.now()
  },
  {
    id: uuidv4(),
    title: 'Avocado Toast',
    description: 'Simple and nutritious breakfast with creamy avocado on crunchy toast.',
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    prepTime: 5,
    cookTime: 3,
    servings: 1,
    ingredients: [
      { id: uuidv4(), name: 'Bread', amount: 2, unit: 'slices' },
      { id: uuidv4(), name: 'Avocado', amount: 1, unit: 'whole' },
      { id: uuidv4(), name: 'Lemon juice', amount: 1, unit: 'tsp' },
      { id: uuidv4(), name: 'Salt', amount: 1, unit: 'pinch' },
      { id: uuidv4(), name: 'Red pepper flakes', amount: 1, unit: 'pinch' },
    ],
    instructions: [
      'Toast bread to desired crispness.',
      'Cut avocado in half, remove pit, and scoop out flesh into a bowl.',
      'Add lemon juice and salt, then mash with a fork to desired consistency.',
      'Spread avocado mixture on toast.',
      'Sprinkle with red pepper flakes.',
      'Optional: top with additional ingredients like eggs, tomatoes, or microgreens.'
    ],
    category: 'Breakfast',
    cuisine: 'California',
    dietary: ['Vegetarian', 'Vegan'],
    favorite: false,
    rating: 5,
    createdAt: Date.now() - 86400000
  },
  {
    id: uuidv4(),
    title: 'Chicken Stir Fry',
    description: 'Quick and healthy stir fry with chicken and colorful vegetables.',
    image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    ingredients: [
      { id: uuidv4(), name: 'Chicken breast', amount: 1, unit: 'lb' },
      { id: uuidv4(), name: 'Bell peppers', amount: 2, unit: 'whole' },
      { id: uuidv4(), name: 'Broccoli', amount: 2, unit: 'cups' },
      { id: uuidv4(), name: 'Carrots', amount: 2, unit: 'whole' },
      { id: uuidv4(), name: 'Soy sauce', amount: 3, unit: 'tbsp' },
      { id: uuidv4(), name: 'Garlic', amount: 2, unit: 'cloves' },
      { id: uuidv4(), name: 'Ginger', amount: 1, unit: 'tbsp' },
      { id: uuidv4(), name: 'Vegetable oil', amount: 2, unit: 'tbsp' },
    ],
    instructions: [
      'Slice chicken breast into thin strips.',
      'Chop all vegetables into bite-sized pieces.',
      'Heat oil in a wok or large skillet over high heat.',
      'Add chicken and cook until no longer pink, about 4-5 minutes.',
      'Remove chicken and set aside.',
      'Add vegetables, garlic, and ginger to the pan and stir-fry for 3-4 minutes.',
      'Return chicken to the pan and add soy sauce.',
      'Stir well and cook for another 2 minutes.',
      'Serve hot over rice or noodles.'
    ],
    category: 'Main Course',
    cuisine: 'Asian',
    dietary: ['High Protein'],
    favorite: true,
    rating: 4,
    createdAt: Date.now() - 172800000
  }
];

export const sampleShoppingLists: ShoppingList[] = [
  {
    id: uuidv4(),
    name: 'Weekly Groceries',
    items: [
      { id: uuidv4(), name: 'Milk', amount: 1, unit: 'gallon', checked: false },
      { id: uuidv4(), name: 'Eggs', amount: 12, unit: 'count', checked: true },
      { id: uuidv4(), name: 'Bread', amount: 1, unit: 'loaf', checked: false },
      { id: uuidv4(), name: 'Chicken breast', amount: 2, unit: 'lbs', checked: false }
    ],
    createdAt: Date.now()
  }
];

export const sampleMealPlans: MealPlan[] = [
  {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    meals: {
      breakfast: sampleRecipes[1].id,
      dinner: sampleRecipes[0].id
    }
  },
  {
    id: uuidv4(),
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    meals: {
      lunch: sampleRecipes[2].id,
      dinner: sampleRecipes[0].id
    }
  }
];