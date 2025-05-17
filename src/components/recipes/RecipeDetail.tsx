import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Heart, 
  Edit, 
  Trash2, 
  Star, 
  ShoppingCart, 
  Calendar 
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes: recipeContext, shoppingList, mealPlan } = useAppContext();
  const [showAddToMealModal, setShowAddToMealModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner');

  if (!id) {
    navigate('/recipes');
    return null;
  }

  const recipe = recipeContext.recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Recipe not found</h2>
          <p className="mt-2 text-gray-500">The recipe you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="primary" 
            className="mt-4" 
            onClick={() => navigate('/recipes')}
          >
            Back to recipes
          </Button>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleEdit = () => {
    navigate(`/recipes/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      recipeContext.removeRecipe(id);
      navigate('/recipes');
    }
  };

  const handleToggleFavorite = () => {
    recipeContext.toggleFavorite(id);
  };

  const handleCreateShoppingList = () => {
    const newList = shoppingList.createFromRecipe(recipe);
    navigate(`/shopping/${newList.id}`);
  };

  const handleRate = (rating: number) => {
    recipeContext.updateRating(id, rating);
  };

  const handleAddToMealPlan = () => {
    setShowAddToMealModal(true);
  };

  const handleSaveToMealPlan = () => {
    mealPlan.saveMealPlanForDate(selectedDate, {
      [selectedMeal]: recipe.id
    });
    setShowAddToMealModal(false);
    navigate('/meal-planner');
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      {/* Recipe Hero Section */}
      <div className="relative rounded-lg overflow-hidden shadow-xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-96 object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-amber-600 px-3 py-1 rounded-full text-sm">
              {recipe.category}
            </span>
            <span className="bg-gray-700 bg-opacity-60 px-3 py-1 rounded-full text-sm">
              {recipe.cuisine}
            </span>
            {recipe.dietary.map(diet => (
              <span key={diet} className="bg-green-700 bg-opacity-60 px-3 py-1 rounded-full text-sm">
                {diet}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-serif font-bold mb-2">
            {recipe.title}
          </h1>
          
          <p className="text-lg text-gray-200 mb-4 max-w-2xl">
            {recipe.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>Prep: {recipe.prepTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>Cook: {recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>Total: {totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={18} />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        {/* Rating */}
        <div className="flex items-center">
          <div className="mr-4">
            <span className="text-sm text-gray-600 mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className="focus:outline-none"
              >
                <Star
                  size={20}
                  className={`inline ${
                    star <= recipe.rating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Heart className={recipe.favorite ? "fill-red-500 text-red-500" : ""} />}
            onClick={handleToggleFavorite}
          >
            {recipe.favorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ShoppingCart size={16} />}
            onClick={handleCreateShoppingList}
          >
            Create Shopping List
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Calendar size={16} />}
            onClick={handleAddToMealPlan}
          >
            Add to Meal Plan
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Edit size={16} />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Recipe Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="bg-amber-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-4 text-amber-800">
              Ingredients
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              For {recipe.servings} servings
            </p>
            
            <ul className="space-y-3">
              {recipe.ingredients.map(ingredient => (
                <li 
                  key={ingredient.id} 
                  className="flex justify-between pb-2 border-b border-amber-100"
                >
                  <span>{ingredient.name}</span>
                  <span className="font-medium text-amber-800">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800">
            Instructions
          </h2>
          
          <ol className="space-y-6">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-full font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="pt-1">
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Add to Meal Plan Modal */}
      {showAddToMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add to Meal Plan</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal
              </label>
              <select
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddToMealModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveToMealPlan}
              >
                Add to Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;