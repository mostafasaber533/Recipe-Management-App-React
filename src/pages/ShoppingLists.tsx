import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const ShoppingLists: React.FC = () => {
  const { shoppingList } = useAppContext();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Handle creating a new list
  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = shoppingList.createList(newListName.trim(), []);
      setNewListName('');
      setShowCreateForm(false);
      navigate(`/shopping/${newList.id}`);
    }
  };

  // Format date to relative time
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours < 1) return 'Just now';
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Otherwise show the date
    return format(timestamp, 'MMM d, yyyy');
  };

  // Calculate completion percentage
  const getCompletionPercentage = (list: typeof shoppingList.shoppingLists[0]): number => {
    if (list.items.length === 0) return 0;
    
    const completedItems = list.items.filter(item => item.checked).length;
    return Math.round((completedItems / list.items.length) * 100);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-serif font-bold">Shopping Lists</h1>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setShowCreateForm(true)}
        >
          Create New List
        </Button>
      </div>
      
      {/* Create new list form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
          <h2 className="text-xl font-bold mb-4">Create a New Shopping List</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List Name
            </label>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Weekly Groceries"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateList}
              disabled={!newListName.trim()}
            >
              Create List
            </Button>
          </div>
        </div>
      )}
      
      {/* Shopping lists */}
      {shoppingList.shoppingLists.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <ShoppingCart size={24} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No shopping lists yet</h2>
          <p className="text-gray-500 mb-6">Create your first shopping list to get started</p>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowCreateForm(true)}
          >
            Create New List
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoppingList.shoppingLists.map(list => (
            <div 
              key={list.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold mb-1 truncate">{list.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>{formatRelativeTime(list.createdAt)}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {list.items.filter(item => item.checked).length} of {list.items.length} items purchased
                  </span>
                  <span>{getCompletionPercentage(list)}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${getCompletionPercentage(list)}%` }}
                  ></div>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
                  {list.items.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${
                        item.checked ? 'bg-green-500' : 'border border-gray-300'
                      }`}></div>
                      <span className={`${item.checked ? 'line-through text-gray-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                  {list.items.length > 5 && (
                    <div className="text-sm text-gray-500 italic">
                      +{list.items.length - 5} more items
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  iconPosition="right"
                  icon={<ArrowRight size={16} />}
                  onClick={() => navigate(`/shopping/${list.id}`)}
                >
                  View List
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Options section */}
      <div className="mt-12 bg-amber-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Shopping List Options</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold flex items-center mb-2">
              <Calendar size={18} className="mr-2 text-amber-600" />
              Create from Meal Plan
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Generate a shopping list based on your weekly meal plan.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/meal-planner')}
            >
              Go to Meal Planner
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold flex items-center mb-2">
              <ShoppingCart size={18} className="mr-2 text-amber-600" />
              Browse Recipes
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Find recipes and add their ingredients to a shopping list.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/recipes')}
            >
              Browse Recipes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingLists;