import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col justify-center items-center relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center space-y-8 p-8"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold text-dark tracking-tight">
                    Welcome to <span className="text-primary">FoodDelivery</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Delicious meals delivered to your doorstep. Manage your orders or administration with ease.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
                    {/* User Login Card */}
                    <RoleCard
                        to="/user"
                        icon={<User size={48} className="text-primary" />}
                        title="User Login"
                        description="Order food, track delivery, and view history."
                        color="border-primary/20 hover:border-primary"
                    />

                    {/* Admin Login Card */}
                    <RoleCard
                        to="/admin"
                        icon={<ShieldCheck size={48} className="text-secondary" />}
                        title="Admin Login"
                        description="Manage orders, update menu, and view stats."
                        color="border-secondary/20 hover:border-secondary"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const RoleCard = ({ to, icon, title, description, color }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`glass-card p-8 w-72 h-80 flex flex-col items-center justify-center text-center gap-4 border-2 transition-all duration-300 cursor-pointer ${color}`}
        >
            <div className="p-4 bg-white rounded-full shadow-sm">{icon}</div>
            <h2 className="text-2xl font-bold text-dark">{title}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
            <div className="mt-4 flex items-center text-dark font-medium group">
                Enter <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </Link>
);

export default LandingPage;
