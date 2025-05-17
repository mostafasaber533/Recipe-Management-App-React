import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import ShoppingLists from './pages/ShoppingLists';
import ShoppingListDetail from './components/shopping/ShoppingListDetail';
import MealPlanner from './pages/MealPlanner';
import Search from './pages/Search';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Recipe routes */}
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/recipes/new" element={<RecipeForm />} />
              <Route path="/recipes/edit/:id" element={<RecipeForm />} />
              
              {/* Shopping list routes */}
              <Route path="/shopping" element={<ShoppingLists />} />
              <Route path="/shopping/:id" element={<ShoppingListDetail />} />
              
              {/* Meal planner routes */}
              <Route path="/meal-planner" element={<MealPlanner />} />
              
              {/* Search */}
              <Route path="/search" element={<Search />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;