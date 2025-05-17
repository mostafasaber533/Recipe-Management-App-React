import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';
import Card, { CardImage, CardContent, CardTitle, CardFooter } from '../ui/Card';
import { Recipe } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { recipes: recipeContext } = useAppContext();
  
  const { 
    id, 
    title, 
    description, 
    image, 
    prepTime, 
    cookTime, 
    servings, 
    favorite,
    category,
    cuisine 
  } = recipe;

  const totalTime = prepTime + cookTime;
  
  const handleClick = () => {
    navigate(`/recipes/${id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    recipeContext.toggleFavorite(id);
  };

  return (
    <Card 
      hover 
      onClick={handleClick}
      className="h-full flex flex-col transition-all duration-300"
    >
      <div className="relative">
        <CardImage 
          src={image} 
          alt={title} 
          aspectRatio="video"
        />
        <button 
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-colors"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            className={favorite ? "fill-red-500 text-red-500" : "text-gray-400"} 
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-3">
          <div className="flex gap-2 text-sm">
            <span className="bg-amber-600 px-2 py-0.5 rounded-full">
              {category}
            </span>
            {cuisine && (
              <span className="bg-gray-700 bg-opacity-70 px-2 py-0.5 rounded-full">
                {cuisine}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="flex-grow">
        <CardTitle className="font-serif text-xl">
          {title}
        </CardTitle>
        <p className="text-gray-600 line-clamp-2 mb-3">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{totalTime} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{servings} servings</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;