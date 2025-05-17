import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const MealPlannerCalendar: React.FC = () => {
  const { mealPlan, recipes: recipeContext } = useAppContext();
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [weekPlans, setWeekPlans] = useState<Record<string, any>>({});
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner');

  // Generate week dates
  useEffect(() => {
    const dates = Array(7)
      .fill(null)
      .map((_, i) => {
        const date = addDays(currentWeekStart, i);
        return format(date, 'yyyy-MM-dd');
      });
    
    setWeekDates(dates);
  }, [currentWeekStart]);

  // Load meal plans for the week
  useEffect(() => {
    if (weekDates.length > 0) {
      const plans = mealPlan.getMealPlansForRange(weekDates[0], weekDates[6]);
      
      // Convert array of plans to object with date as key
      const plansByDate: Record<string, any> = {};
      plans.forEach(plan => {
        plansByDate[plan.date] = plan;
      });
      
      setWeekPlans(plansByDate);
    }
  }, [weekDates, mealPlan]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  // Jump to current week
  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Format date to display
  const formatDayDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    
    const dayName = format(date, 'EEE');
    const dayNumber = format(date, 'd');
    
    return (
      <div className={`text-center ${isSameDay(date, today) ? 'font-bold' : ''}`}>
        <div className="text-sm">{dayName}</div>
        <div className={`h-8 w-8 flex items-center justify-center mx-auto rounded-full ${
          isSameDay(date, today) 
            ? 'bg-amber-600 text-white' 
            : 'text-gray-700'
        }`}>
          {dayNumber}
        </div>
      </div>
    );
  };

  // Handle adding a meal
  const handleAddMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowAddMealModal(true);
  };

  // Handle removing a meal
  const handleRemoveMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    mealPlan.clearMeal(date, mealType);
    
    // Update local state for immediate UI feedback
    setWeekPlans(prevPlans => {
      const updatedPlans = { ...prevPlans };
      
      if (updatedPlans[date]) {
        const updatedMeals = { ...updatedPlans[date].meals };

        updatedMeals[mealType] = undefined;
        updatedPlans[date] = {
          ...updatedPlans[date],
          meals: updatedMeals
        };
      }
      
      return updatedPlans;
    });
  };

  // Render meal for a given date and meal type
  const renderMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const plan = weekPlans[date];
    const mealId = plan?.meals[mealType];
    
    if (!mealId) {
      return (
        <button 
          onClick={() => handleAddMeal(date, mealType)}
          className="w-full h-full min-h-16 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded transition-colors"
        >
          <Plus size={20} />
        </button>
      );
    }
    
    const recipe = recipeContext.getRecipeById(mealId);
    
    if (!recipe) {
      return (
        <div className="p-2 text-gray-500 italic text-sm">
          Recipe not found
        </div>
      );
    }
    
    return (
      <div className="p-2 group relative">
        <div 
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button 
            onClick={() => handleRemoveMeal(date, mealType)}
            className="bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
        
        <div 
          className="cursor-pointer"
          onClick={() => navigate(`/recipes/${recipe.id}`)}
        >
          <div className="w-full h-16 bg-gray-200 rounded overflow-hidden mb-1">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-medium text-sm truncate">{recipe.title}</div>
        </div>
      </div>
    );
  };

  // Render recipe selection modal
  const renderAddMealModal = () => {
    if (!showAddMealModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Add a Recipe</h2>
          <p className="text-gray-600 mb-4">
            Select a recipe for {selectedMealType} on {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </p>
          
          <div className="grid gap-4 mb-4">
            {recipeContext.recipes.map(recipe => (
              <div 
                key={recipe.id}
                className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  mealPlan.saveMealPlanForDate(selectedDate, { 
                    [selectedMealType]: recipe.id 
                  });
                  setShowAddMealModal(false);
                  
                  // Update local state for immediate UI feedback
                  setWeekPlans(prevPlans => {
                    const updatedPlans = { ...prevPlans };
                    const existingPlan = updatedPlans[selectedDate];
                    
                    if (existingPlan) {
                      updatedPlans[selectedDate] = {
                        ...existingPlan,
                        meals: {
                          ...existingPlan.meals,
                          [selectedMealType]: recipe.id
                        }
                      };
                    } else {
                      // Create new plan for this date
                      updatedPlans[selectedDate] = {
                        id: Math.random().toString(),
                        date: selectedDate,
                        meals: {
                          [selectedMealType]: recipe.id
                        }
                      };
                    }
                    
                    return updatedPlans;
                  });
                }}
              >
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{recipe.title}</div>
                  <div className="text-sm text-gray-500">{recipe.cuisine} • {recipe.category}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowAddMealModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-bold">Meal Planner</h2>
          <div className="text-gray-500">
            {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentWeek}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ChevronLeft size={16} />}
            onClick={goToPreviousWeek}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconPosition="right"
            icon={<ChevronRight size={16} />}
            onClick={goToNextWeek}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Days header */}
          <div className="grid grid-cols-7 border-b">
            {weekDates.map(date => (
              <div key={date} className="p-2 border-r last:border-r-0">
                {formatDayDisplay(date)}
              </div>
            ))}
          </div>
          
          {/* Breakfast row */}
          <div className="grid grid-cols-7 border-b">
            {weekDates.map(date => (
              <div key={`breakfast-${date}`} className="p-2 border-r last:border-r-0">
                <div className="text-xs font-medium text-gray-500 mb-1">Breakfast</div>
                {renderMeal(date, 'breakfast')}
              </div>
            ))}
          </div>
          
          {/* Lunch row */}
          <div className="grid grid-cols-7 border-b">
            {weekDates.map(date => (
              <div key={`lunch-${date}`} className="p-2 border-r last:border-r-0">
                <div className="text-xs font-medium text-gray-500 mb-1">Lunch</div>
                {renderMeal(date, 'lunch')}
              </div>
            ))}
          </div>
          
          {/* Dinner row */}
          <div className="grid grid-cols-7">
            {weekDates.map(date => (
              <div key={`dinner-${date}`} className="p-2 border-r last:border-r-0">
                <div className="text-xs font-medium text-gray-500 mb-1">Dinner</div>
                {renderMeal(date, 'dinner')}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add meal modal */}
      {renderAddMealModal()}
    </div>
  );
};

export default MealPlannerCalendar;