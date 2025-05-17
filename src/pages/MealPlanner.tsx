import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import MealPlannerCalendar from '../components/mealplan/MealPlannerCalendar';
import { v4 as uuidv4 } from 'uuid';

const MealPlanner: React.FC = () => {
  const { mealPlan, shoppingList, recipes: recipeContext } = useAppContext();
  const navigate = useNavigate();

  // Generate a shopping list from the current week's meal plan
  const generateShoppingList = () => {
    // Get current week dates
    const weekDates = mealPlan.getWeekDates();
    
    // Get all meal plans for the week
    const weekPlans = mealPlan.getMealPlansForRange(weekDates[0], weekDates[6]);
    
    // Extract all recipe IDs
    const recipeIds: string[] = [];
    weekPlans.forEach(plan => {
      if (plan.meals.breakfast) recipeIds.push(plan.meals.breakfast);
      if (plan.meals.lunch) recipeIds.push(plan.meals.lunch);
      if (plan.meals.dinner) recipeIds.push(plan.meals.dinner);
      if (plan.meals.snacks) recipeIds.push(...plan.meals.snacks);
    });
    
    // Get unique recipe IDs
    const uniqueRecipeIds = [...new Set(recipeIds)];
    
    // Get recipes and their ingredients
    const allIngredients = uniqueRecipeIds
      .map(id => recipeContext.getRecipeById(id))
      .filter(recipe => recipe) // Filter out any undefined recipes
      .flatMap(recipe => recipe!.ingredients.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        recipeId: recipe!.id
      })));
    
    // Combine ingredients with the same name and unit
    const combinedIngredients: Record<string, {
      name: string;
      amount: number;
      unit: string;
      recipeId?: string;
    }> = {};
    
    allIngredients.forEach(ing => {
      const key = `${ing.name.toLowerCase()}_${ing.unit}`;
      
      if (combinedIngredients[key]) {
        combinedIngredients[key].amount += ing.amount;
      } else {
        combinedIngredients[key] = { ...ing };
      }
    });
    
    // Create a new shopping list
    const newList = shoppingList.createList(
      `Meal Plan: ${weekDates[0]} to ${weekDates[6]}`,
      Object.values(combinedIngredients)
    );
    
    // Navigate to the new shopping list
    navigate(`/shopping/${newList.id}`);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Meal Planner</h1>
        <p className="text-gray-600">
          Plan your meals for the week and generate shopping lists.
        </p>
      </div>
      
      {/* Meal planner calendar */}
      <MealPlannerCalendar />
      
      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4 justify-end">
        <Button
          variant="primary"
          icon={<ShoppingCart size={16} />}
          onClick={generateShoppingList}
        >
          Generate Shopping List
        </Button>
        <Button
          variant="outline"
          icon={<FileText size={16} />}
          onClick={() => navigate('/recipes')}
        >
          Browse Recipes
        </Button>
      </div>
      
      {/* Tips section */}
      <div className="mt-12 bg-amber-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Meal Planning Tips</h2>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Plan a variety of meals to keep your diet balanced and interesting.</li>
          <li>Consider leftovers when planning—cook once, eat twice!</li>
          <li>Check your calendar for busy days and plan simpler meals for those times.</li>
          <li>Batch cooking on weekends can save time during busy weekdays.</li>
          <li>Try to incorporate seasonal ingredients for better flavor and value.</li>
        </ul>
      </div>
    </div>
  );
};

export default MealPlanner;