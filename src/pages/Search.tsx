import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import RecipeCard from '../components/recipes/RecipeCard';

const Search: React.FC = () => {
  const { recipes: recipeContext } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(recipeContext.recipes);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Clear search input
  const clearSearch = () => {
    setQuery('');
  };

  // Search recipes when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(recipeContext.recipes);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for better UX
    const timer = setTimeout(() => {
      const filtered = recipeContext.filterRecipes({ search: query });
      setResults(filtered);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, recipeContext.recipes, recipeContext.filterRecipes]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      {/* Search header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-4">Search Recipes</h1>
        <p className="text-gray-600 mb-6">
          Find recipes by name, ingredient, or description.
        </p>
        
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search for recipes..."
            className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm text-lg"
            autoFocus
          />
          <SearchIcon 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={22} 
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>
          )}
        </div>
      </div>
      
      {/* Search results */}
      <div>
        {isSearching ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        ) : (
          <>
            {query && (
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  Found {results.length} {results.length === 1 ? 'recipe' : 'recipes'} 
                  {query && ` for "${query}"`}
                </p>
              </div>
            )}
            
            {results.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No recipes found</h2>
                <p className="text-gray-500">
                  Try different keywords or browse all recipes
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;