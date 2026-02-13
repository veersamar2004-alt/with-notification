import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data (replace with API call later)
const MOCK_MENU = [
    { id: 1, name: 'Margherita Pizza', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Burger & Fries', price: 15.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Sushi Platter', price: 24.99, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Pasta Carbonara', price: 14.50, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Vegan Salad', price: 10.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
    { id: 6, name: 'Chocolate Cake', price: 8.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
];

const Menu = () => {
    const [cart, setCart] = useState({});

    const addToCart = (id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 0) {
                newCart[id] -= 1;
                if (newCart[id] === 0) delete newCart[id];
            }
            return newCart;
        });
    };

    return (
        <div className="pt-32 px-6 max-w-7xl mx-auto pb-12">
            <h2 className="text-4xl font-bold mb-8 text-center text-dark">Our Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_MENU.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-card overflow-hidden group"
                    >
                        <div className="relative overflow-hidden h-64">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-dark">{item.name}</h3>
                                <span className="text-xl font-semibold text-primary">${item.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                {cart[item.id] ? (
                                    <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-primary"><Minus size={18} /></button>
                                        <span className="font-bold w-4 text-center">{cart[item.id]}</span>
                                        <button onClick={() => addToCart(item.id)} className="p-1 hover:text-primary"><Plus size={18} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => addToCart(item.id)} className="btn-primary w-full">Add to Cart</button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
