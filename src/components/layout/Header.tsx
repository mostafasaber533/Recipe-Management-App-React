import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, Search } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-serif font-bold text-amber-700"
          >
            <ChefHat size={28} className="text-amber-600" />
            <span>RecipeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" isActive={location.pathname === '/'} />
            <NavLink to="/recipes" label="Recipes" isActive={location.pathname.startsWith('/recipes')} />
            <NavLink to="/shopping" label="Shopping Lists" isActive={location.pathname.startsWith('/shopping')} />
            <NavLink to="/meal-planner" label="Meal Planner" isActive={location.pathname.startsWith('/meal-planner')} />
            <Link to="/search" className="text-gray-600 hover:text-amber-600 transition-colors">
              <Search size={20} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 hover:text-amber-600 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fadeIn">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" label="Home" isActive={location.pathname === '/'} />
            <MobileNavLink to="/recipes" label="Recipes" isActive={location.pathname.startsWith('/recipes')} />
            <MobileNavLink to="/shopping" label="Shopping Lists" isActive={location.pathname.startsWith('/shopping')} />
            <MobileNavLink to="/meal-planner" label="Meal Planner" isActive={location.pathname.startsWith('/meal-planner')} />
            <MobileNavLink to="/search" label="Search Recipes" isActive={location.pathname === '/search'} />
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop Nav Link Component
interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => (
  <Link 
    to={to} 
    className={`font-medium transition-colors ${
      isActive 
        ? 'text-amber-600 border-b-2 border-amber-600' 
        : 'text-gray-600 hover:text-amber-600'
    }`}
  >
    {label}
  </Link>
);

// Mobile Nav Link Component
const MobileNavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => (
  <Link 
    to={to} 
    className={`py-2 border-b border-gray-100 font-medium transition-colors ${
      isActive 
        ? 'text-amber-600' 
        : 'text-gray-600'
    }`}
  >
    {label}
  </Link>
);

export default Header;