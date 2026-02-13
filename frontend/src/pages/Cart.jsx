import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    // This is just a UI mockup for now, real cart state needs context/redux
    const [isOrdering, setIsOrdering] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        setIsOrdering(true);
        try {
            // Hardcoded user and restaurant for demo
            const orderData = {
                customerId: 101,
                restaurantId: 202,
                items: [
                    { menuItemId: 1, quantity: 2, price: 12.99 },
                    { menuItemId: 3, quantity: 1, price: 24.99 }
                ]
            };

            await axios.post('http://localhost:8081/orders', orderData);
            alert("Order Placed Successfully!");
            navigate('/');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order");
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <div className="pt-32 px-6 max-w-4xl mx-auto pb-12">
            <h2 className="text-4xl font-bold mb-8 text-center text-dark">Your Cart</h2>

            <div className="glass-card p-8">
                {/* Mock Items */}
                <div className="space-y-6">
                    <CartItem name="Margherita Pizza" price="12.99" qty="2" />
                    <CartItem name="Sushi Platter" price="24.99" qty="1" />
                </div>

                <div className="mt-8 border-t pt-6 flex justify-between items-center">
                    <span className="text-2xl font-bold">Total</span>
                    <span className="text-3xl font-extrabold text-primary">$50.97</span>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className="w-full btn-primary mt-8 py-4 text-xl rounded-xl"
                >
                    {isOrdering ? 'Placing Order...' : 'Checkout'}
                </button>
            </div>
        </div>
    );
};

const CartItem = ({ name, price, qty }) => (
    <div className="flex justify-between items-center border-b pb-4 last:border-0">
        <div>
            <h4 className="text-xl font-bold">{name}</h4>
            <p className="text-gray-500">${price} x {qty}</p>
        </div>
        <span className="font-bold text-lg">${(parseFloat(price) * parseInt(qty)).toFixed(2)}</span>
    </div>
);

export default Cart;
