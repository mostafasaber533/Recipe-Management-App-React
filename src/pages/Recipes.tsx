import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import RecipeCard from '../components/recipes/RecipeCard';
import Button from '../components/ui/Button';

const Recipes: React.FC = () => {
  const { recipes: recipeContext } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<{
    search: string;
    category: string;
    cuisine: string;
    dietary: string;
    favorite: boolean;
  }>({
    search: '',
    category: '',
    cuisine: '',
    dietary: '',
    favorite: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(recipeContext.recipes);
  
  // Extract unique filter options
  const categories = [...new Set(recipeContext.recipes.map(recipe => recipe.category))];
  const cuisines = [...new Set(recipeContext.recipes.map(recipe => recipe.cuisine))];
  const dietaryOptions = [...new Set(recipeContext.recipes.flatMap(recipe => recipe.dietary))];

  // Parse URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const favorite = urlParams.get('favorite') === 'true';
    
    if (favorite) {
      setSearchParams(prev => ({ ...prev, favorite }));
      setShowFilters(true);
    }
  }, [location.search]);

  // Filter recipes based on search params
  useEffect(() => {
    setFilteredRecipes(recipeContext.filterRecipes({
      search: searchParams.search,
      category: searchParams.category,
      cuisine: searchParams.cuisine,
      dietary: searchParams.dietary,
      favorite: searchParams.favorite
    }));
  }, [recipeContext.recipes, searchParams, recipeContext.filterRecipes]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle filter changes
  const handleFilterChange = (
    filter: 'category' | 'cuisine' | 'dietary' | 'favorite',
    value: string | boolean
  ) => {
    setSearchParams(prev => ({ ...prev, [filter]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({
      search: '',
      category: '',
      cuisine: '',
      dietary: '',
      favorite: false
    });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchParams.category !== '' || 
    searchParams.cuisine !== '' || 
    searchParams.dietary !== '' || 
    searchParams.favorite;

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-serif font-bold">Recipes</h1>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/recipes/new')}
        >
          Add New Recipe
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search input */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchParams.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchParams.search && (
                <button
                  onClick={() => setSearchParams(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Filter toggle button */}
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? 'relative' : ''}
          >
            Filters
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </Button>
          
          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-md animate-fadeIn">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={searchParams.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Cuisine filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine
                </label>
                <select
                  value={searchParams.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              
              {/* Dietary filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary
                </label>
                <select
                  value={searchParams.dietary}
                  onChange={(e) => handleFilterChange('dietary', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Dietary Options</option>
                  {dietaryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {/* Favorites filter */}
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchParams.favorite}
                    onChange={(e) => handleFilterChange('favorite', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Favorites Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Recipe grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">No recipes found</h2>
          <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;