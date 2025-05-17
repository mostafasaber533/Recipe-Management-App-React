import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ShoppingCart, Calendar, Search, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import RecipeCard from '../components/recipes/RecipeCard';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { recipes: recipeContext } = useAppContext();
  
  // Get favorite recipes
  const favoriteRecipes = recipeContext.recipes
    .filter(recipe => recipe.favorite)
    .slice(0, 3);
  
  // Get recent recipes
  const recentRecipes = [...recipeContext.recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <div>
      {/* Hero section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Kitchen with ingredients"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 animate-fadeIn">
            Your Personal Recipe Hub
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-200 animate-fadeIn animation-delay-100">
            Store recipes, create shopping lists, and plan your meals all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn animation-delay-200">
            <Link to="/recipes">
              <Button 
                variant="primary" 
                size="lg"
                icon={<ChefHat size={20} />}
              >
                Browse Recipes
              </Button>
            </Link>
            <Link to="/recipes/new">
              <Button 
                variant="outline" 
                size="lg"
              >
                Add New Recipe
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-45 translate-y-[-2px]"></div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Everything You Need, All in One Place
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ChefHat size={24} className="text-amber-600" />}
              title="Recipe Management"
              description="Save all your favorite recipes in one place with ingredients, instructions, and photos."
              linkTo="/recipes"
              linkText="Browse Recipes"
            />
            <FeatureCard 
              icon={<ShoppingCart size={24} className="text-amber-600" />}
              title="Shopping Lists"
              description="Automatically create shopping lists from your recipes, making grocery shopping easier."
              linkTo="/shopping"
              linkText="View Shopping Lists"
            />
            <FeatureCard 
              icon={<Calendar size={24} className="text-amber-600" />}
              title="Meal Planning"
              description="Plan your meals for the week ahead, ensuring you always know what's for dinner."
              linkTo="/meal-planner"
              linkText="Plan Your Meals"
            />
          </div>
        </div>
      </section>
      
      {/* Favorite recipes section */}
      {favoriteRecipes.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-bold flex items-center">
                <Heart size={20} className="mr-2 text-red-500 fill-red-500" />
                Your Favorite Recipes
              </h2>
              <Link to="/recipes?favorite=true">
                <Button variant="outline" size="sm">
                  See All Favorites
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {favoriteRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Recent recipes section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold">
              Recently Added Recipes
            </h2>
            <Link to="/recipes">
              <Button variant="outline" size="sm">
                See All Recipes
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Ready to Get Cooking?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-amber-100">
            Start organizing your recipes, planning your meals, and simplifying your cooking experience today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/recipes/new">
              <Button 
                variant="primary" 
                size="lg"
                className="bg-white text-amber-800 hover:bg-amber-100"
              >
                Add Your First Recipe
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-amber-700"
                icon={<Search size={20} />}
              >
                Search Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  linkTo, 
  linkText 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={linkTo} className="text-amber-600 font-medium hover:text-amber-700">
      {linkText} →
    </Link>
  </div>
);

export default Home;