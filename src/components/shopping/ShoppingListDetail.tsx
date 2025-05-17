import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import { ShoppingListItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const ShoppingListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shoppingList } = useAppContext();
  const [listName, setListName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShoppingListItem, 'id' | 'checked'>>({
    name: '',
    amount: 1,
    unit: 'item'
  });
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  if (!id) {
    navigate('/shopping');
    return null;
  }

  const list = shoppingList.shoppingLists.find(l => l.id === id);

  if (!list) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Shopping list not found</h2>
          <p className="mt-2 text-gray-500">The shopping list you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="primary" 
            className="mt-4" 
            onClick={() => navigate('/shopping')}
          >
            Back to shopping lists
          </Button>
        </div>
      </div>
    );
  }

  // Start editing name
  const handleEditName = () => {
    setListName(list.name);
    setIsEditingName(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  // Save new name
  const handleSaveName = () => {
    if (listName.trim()) {
      const updatedList = {
        ...list,
        name: listName.trim()
      };
      shoppingList.updateList(updatedList);
    }
    setIsEditingName(false);
  };

  // Toggle item checked status
  const handleToggleItem = (itemId: string) => {
    shoppingList.toggleItemChecked(id, itemId);
  };

  // Remove item from list
  const handleRemoveItem = (itemId: string) => {
    const updatedList = {
      ...list,
      items: list.items.filter(item => item.id !== itemId)
    };
    shoppingList.updateList(updatedList);
  };

  // Add new item to list
  const handleAddItem = () => {
    if (newItem.name.trim()) {
      const updatedList = {
        ...list,
        items: [
          ...list.items,
          {
            id: uuidv4(),
            name: newItem.name.trim(),
            amount: newItem.amount || 1,
            unit: newItem.unit || 'item',
            checked: false
          }
        ]
      };
      shoppingList.updateList(updatedList);
      setNewItem({
        name: '',
        amount: 1,
        unit: 'item'
      });
      setShowAddItemForm(false);
    }
  };

  // Delete entire shopping list
  const handleDeleteList = () => {
    if (window.confirm('Are you sure you want to delete this shopping list?')) {
      shoppingList.deleteList(id);
      navigate('/shopping');
    }
  };

  // Count checked and total items
  const checkedItems = list.items.filter(item => item.checked).length;
  const totalItems = list.items.length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="container mx-auto px-4 pt-24 pb-10">
      <div className="max-w-2xl mx-auto">
        {/* Header with title and actions */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="text-2xl font-serif font-bold border-b-2 border-amber-300 focus:border-amber-500 outline-none"
                />
                <button onClick={handleSaveName} className="text-green-500 hover:text-green-600">
                  <Save size={20} />
                </button>
                <button onClick={() => setIsEditingName(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-gray-800">{list.name}</h1>
                <button onClick={handleEditName} className="text-gray-400 hover:text-gray-600">
                  <Edit size={18} />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">Created {new Date(list.createdAt).toLocaleDateString()}</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={handleDeleteList}
          >
            Delete List
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{checkedItems} of {totalItems} items purchased</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Shopping list items */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {list.items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              This shopping list is empty. Add some items to get started.
            </p>
          ) : (
            <ul className="divide-y">
              {list.items.map(item => (
                <li key={item.id} className="py-3 flex items-center">
                  <button 
                    onClick={() => handleToggleItem(item.id)}
                    className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                      item.checked 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {item.checked && <Check size={14} />}
                  </button>
                  
                  <div className="flex-1">
                    <span className={`${item.checked ? 'line-through text-gray-400' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                  
                  <div className="text-right mr-3 text-gray-600">
                    {item.amount} {item.unit}
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Add item form */}
        {showAddItemForm ? (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fadeIn">
            <h3 className="font-medium mb-3">Add New Item</h3>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Milk"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="item">item</option>
                  <option value="g">grams (g)</option>
                  <option value="kg">kilograms (kg)</option>
                  <option value="lb">pounds (lb)</option>
                  <option value="oz">ounces (oz)</option>
                  <option value="ml">milliliters (ml)</option>
                  <option value="l">liters (l)</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tablespoon</option>
                  <option value="tsp">teaspoon</option>
                  <option value="bunch">bunch</option>
                  <option value="package">package</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddItemForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddItem}
                disabled={!newItem.name.trim()}
              >
                Add Item
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            className="w-full"
            onClick={() => setShowAddItemForm(true)}
          >
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShoppingListDetail;