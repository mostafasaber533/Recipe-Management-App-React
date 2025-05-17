import { useState, useEffect, useCallback } from 'react';
import { ShoppingList, ShoppingListItem, Recipe } from '../types';
import { getShoppingLists, saveShoppingList, deleteShoppingList } from '../utils/storageUtils';
import { v4 as uuidv4 } from 'uuid';

export const useShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load shopping lists
  useEffect(() => {
    setShoppingLists(getShoppingLists());
    setIsLoading(false);
  }, []);

  // Create a new shopping list
  const createList = useCallback((name: string, items: Omit<ShoppingListItem, 'id'>[]) => {
    const newList: ShoppingList = {
      id: uuidv4(),
      name,
      items: items.map(item => ({ ...item, id: uuidv4(), checked: false })),
      createdAt: Date.now()
    };
    
    saveShoppingList(newList);
    setShoppingLists(prev => [...prev, newList]);
    return newList;
  }, []);

  // Add items to an existing list
  const addItems = useCallback((listId: string, newItems: Omit<ShoppingListItem, 'id'>[]) => {
    setShoppingLists(prev => {
      const updatedLists = prev.map(list => {
        if (list.id === listId) {
          // Add new items, avoiding duplicates by combining quantities
          const updatedItems = [...list.items];
          
          newItems.forEach(newItem => {
            const existingItemIndex = updatedItems.findIndex(
              item => item.name.toLowerCase() === newItem.name.toLowerCase() && item.unit === newItem.unit
            );
            
            if (existingItemIndex >= 0) {
              // Combine with existing item
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                amount: updatedItems[existingItemIndex].amount + newItem.amount
              };
            } else {
              // Add as new item
              updatedItems.push({
                ...newItem,
                id: uuidv4(),
                checked: false
              });
            }
          });
          
          const updatedList = { ...list, items: updatedItems };
          saveShoppingList(updatedList);
          return updatedList;
        }
        return list;
      });
      
      return updatedLists;
    });
  }, []);

  // Update a shopping list
  const updateList = useCallback((updatedList: ShoppingList) => {
    saveShoppingList(updatedList);
    setShoppingLists(prev => prev.map(list => list.id === updatedList.id ? updatedList : list));
  }, []);

  // Delete a shopping list
  const deleteList = useCallback((id: string) => {
    deleteShoppingList(id);
    setShoppingLists(prev => prev.filter(list => list.id !== id));
  }, []);

  // Toggle item checked status
  const toggleItemChecked = useCallback((listId: string, itemId: string) => {
    setShoppingLists(prev => {
      const updatedLists = prev.map(list => {
        if (list.id === listId) {
          const updatedItems = list.items.map(item => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          });
          
          const updatedList = { ...list, items: updatedItems };
          saveShoppingList(updatedList);
          return updatedList;
        }
        return list;
      });
      
      return updatedLists;
    });
  }, []);

  // Create shopping list from recipe
  const createFromRecipe = useCallback((recipe: Recipe, listName?: string) => {
    const name = listName || `${recipe.title} Shopping List`;
    const items = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      recipeId: recipe.id
    }));
    
    return createList(name, items);
  }, [createList]);

  return {
    shoppingLists,
    isLoading,
    createList,
    updateList,
    deleteList,
    addItems,
    toggleItemChecked,
    createFromRecipe
  };
};