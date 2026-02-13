import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from './Home';
import Menu from './Menu';
import Cart from './Cart';

const UserDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-dark">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<Navigate to="/user" replace />} />
            </Routes>
        </div>
    );
};

export default UserDashboard;
