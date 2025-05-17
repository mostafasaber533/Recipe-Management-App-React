import React from 'react';
import { Heart, Github, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="text-2xl font-serif font-bold text-amber-500">
              RecipeHub
            </Link>
            <p className="mt-4 text-gray-400">
              Your personal recipe management system. Store recipes, create shopping lists, and plan meals all in one place.
            </p>
            <div className="flex mt-6 space-x-4">
              <SocialLink icon={<Github size={20} />} href="#" />
              <SocialLink icon={<Instagram size={20} />} href="#" />
              <SocialLink icon={<Mail size={20} />} href="#" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/recipes" label="Recipes" />
              <FooterLink to="/shopping" label="Shopping Lists" />
              <FooterLink to="/meal-planner" label="Meal Planner" />
              <FooterLink to="/search" label="Search" />
            </nav>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Recipe Management</li>
              <li>Shopping List Creation</li>
              <li>Meal Planning</li>
              <li>Recipe Search</li>
              <li>Recipe Rating System</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p className="flex items-center justify-center">
            Made with <Heart size={16} className="text-red-500 mx-1" /> &copy; {year} RecipeHub
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => (
  <a 
    href={href} 
    className="bg-gray-800 hover:bg-amber-600 transition-colors p-2 rounded-full"
    target="_blank" 
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  to: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, label }) => (
  <Link 
    to={to} 
    className="text-gray-400 hover:text-amber-500 transition-colors"
  >
    {label}
  </Link>
);

export default Footer;