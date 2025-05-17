import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, X, ArrowLeft, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { Recipe, Ingredient } from '../types';

const RecipeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes: recipeContext } = useAppContext();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    image: '',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [],
    instructions: [''],
    category: '',
    cuisine: '',
    dietary: [],
    favorite: false,
    rating: 0
  });

  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    amount: 1,
    unit: 'tbsp'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing recipe data if editing
  useEffect(() => {
    if (isEditing && id) {
      const recipe = recipeContext.getRecipeById(id);
      if (recipe) {
        setFormData({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          category: recipe.category,
          cuisine: recipe.cuisine,
          dietary: recipe.dietary,
          favorite: recipe.favorite,
          rating: recipe.rating
        });
      } else {
        navigate('/recipes');
      }
    }
  }, [isEditing, id, recipeContext, navigate]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // Handle dietary checkbox changes
  const handleDietaryChange = (option: string) => {
    setFormData(prev => {
      const dietary = [...prev.dietary];
      const index = dietary.indexOf(option);
      
      if (index === -1) {
        dietary.push(option);
      } else {
        dietary.splice(index, 1);
      }
      
      return { ...prev, dietary };
    });
  };

  // Handle new ingredient input changes
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) || 0 : value 
    }));
  };

  // Add a new ingredient
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIngredient.name.trim()) {
      return;
    }
    
    const ingredient: Ingredient = {
      ...newIngredient,
      id: uuidv4()
    };
    
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }));
    
    // Reset new ingredient form
    setNewIngredient({
      name: '',
      amount: 1,
      unit: 'tbsp'
    });
  };

  // Remove an ingredient
  const handleRemoveIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(item => item.id !== id)
    }));
  };

  // Handle instruction changes
  const handleInstructionChange = (index: number, value: string) => {
    setFormData(prev => {
      const instructions = [...prev.instructions];
      instructions[index] = value;
      return { ...prev, instructions };
    });
  };

  // Add a new instruction step
  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  // Remove an instruction step
  const handleRemoveInstruction = (index: number) => {
    setFormData(prev => {
      const instructions = [...prev.instructions];
      instructions.splice(index, 1);
      return { ...prev, instructions };
    });
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    
    if (formData.instructions.length === 0 || !formData.instructions[0].trim()) {
      newErrors.instructions = 'At least one instruction step is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.cuisine.trim()) {
      newErrors.cuisine = 'Cuisine is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Filter out empty instructions
    const cleanedFormData = {
      ...formData,
      instructions: formData.instructions.filter(step => step.trim() !== '')
    };
    
    if (isEditing && id) {
      recipeContext.updateRecipe({
        ...cleanedFormData,
        id,
        createdAt: recipeContext.getRecipeById(id)?.createdAt || Date.now()
      });
    } else {
      recipeContext.addRecipe(cleanedFormData);
    }
    
    navigate('/recipes');
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-amber-600 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-serif font-bold">
            {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                  placeholder="e.g., Creamy Garlic Pasta"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 error-message">{errors.title}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-2 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                  placeholder="Briefly describe your recipe..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 error-message">{errors.description}</p>
                )}
              </div>
              
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL*
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  } rounded-md`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1 error-message">{errors.image}</p>
                )}
                
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Recipe preview"
                      className="h-40 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Times and servings */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    } rounded-md`}
                  >
                    <option value="">Select Category</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Salad">Salad</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                    <option value="Soup">Soup</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.category}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine*
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.cuisine ? 'border-red-500' : 'border-gray-300'
                    } rounded-md`}
                  >
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Asian">Asian</option>
                    <option value="Indian">Indian</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Thai">Thai</option>
                    <option value="Greek">Greek</option>
                    <option value="Spanish">Spanish</option>
                    <option value="California">California</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.cuisine && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors.cuisine}</p>
                  )}
                </div>
              </div>
              
              {/* Dietary options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Options
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High Protein'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.dietary.includes(option)}
                        onChange={() => handleDietaryChange(option)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Ingredients */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            
            {errors.ingredients && (
              <p className="text-red-500 text-sm mb-2 error-message">{errors.ingredients}</p>
            )}
            
            {/* Ingredient list */}
            {formData.ingredients.length > 0 && (
              <div className="mb-4">
                <ul className="divide-y">
                  {formData.ingredients.map(ingredient => (
                    <li key={ingredient.id} className="py-2 flex justify-between items-center">
                      <span>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Add ingredient form */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid md:grid-cols-5 gap-2 mb-2">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-700 mb-1">
                    Ingredient Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newIngredient.name}
                    onChange={handleIngredientChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                    placeholder="e.g., Garlic"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={newIngredient.amount}
                    onChange={handleIngredientChange}
                    step="0.25"
                    min="0"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={newIngredient.unit}
                    onChange={handleIngredientChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="tsp">teaspoon (tsp)</option>
                    <option value="tbsp">tablespoon (tbsp)</option>
                    <option value="cup">cup</option>
                    <option value="oz">ounce (oz)</option>
                    <option value="g">gram (g)</option>
                    <option value="kg">kilogram (kg)</option>
                    <option value="lb">pound (lb)</option>
                    <option value="ml">milliliter (ml)</option>
                    <option value="l">liter (l)</option>
                    <option value="pinch">pinch</option>
                    <option value="cloves">cloves</option>
                    <option value="whole">whole</option>
                    <option value="slice">slice</option>
                    <option value="item">item</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAddIngredient}
                    disabled={!newIngredient.name.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Instructions */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            
            {errors.instructions && (
              <p className="text-red-500 text-sm mb-2 error-message">{errors.instructions}</p>
            )}
            
            <div className="space-y-3">
              {formData.instructions.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-amber-600 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      value={step}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      className="w-full p-2 pr-8 border border-gray-300 rounded-md"
                      placeholder={`Step ${index + 1} instruction...`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      disabled={formData.instructions.length <= 1}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                icon={<Plus size={16} />}
                onClick={handleAddInstruction}
              >
                Add Step
              </Button>
            </div>
          </section>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
            >
              {isEditing ? 'Update Recipe' : 'Save Recipe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;