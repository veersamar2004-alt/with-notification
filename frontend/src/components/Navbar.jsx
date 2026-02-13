import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Home, Utensils, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card m-4 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                <Utensils /> FoodieApp
            </Link>
            <div className="flex gap-6">
                <NavLink to="/" icon={<Home size={20} />} text="Home" />
                <NavLink to="/menu" icon={<Utensils size={20} />} text="Menu" />
                <NavLink to="/cart" icon={<ShoppingCart size={20} />} text="Cart" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, text }) => (
    <Link to={to} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
        {icon}
        <span>{text}</span>
    </Link>
);

export default Navbar;
