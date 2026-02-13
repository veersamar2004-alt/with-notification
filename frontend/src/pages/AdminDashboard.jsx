import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Settings, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark text-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold text-primary mb-8">AdminPanel</h2>
                <nav className="space-y-4">
                    <NavItem icon={<Package size={20} />} label="Orders" active />
                    <NavItem icon={<TrendingUp size={20} />} label="Statistics" />
                    <NavItem icon={<PlusCircle size={20} />} label="Menu Items" />
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-dark">Dashboard Overview</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, Admin</span>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">A</div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Orders" value="1,234" change="+12%" />
                    <StatCard title="Revenue" value="$45,678" change="+8%" />
                    <StatCard title="Active Users" value="890" change="+24%" />
                </div>

                {/* Recent Orders Table (Mock) */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-gray-500 border-b">
                                <tr>
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <OrderRow id="#ORD-001" customer="John Doe" status="Pending" total="$24.50" />
                                <OrderRow id="#ORD-002" customer="Jane Smith" status="Delivered" total="$18.00" />
                                <OrderRow id="#ORD-003" customer="Bob Johnson" status="Cooking" total="$45.20" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
        {icon}
        <span className="font-medium">{label}</span>
    </div>
);

const StatCard = ({ title, value, change }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-gray-500 text-sm mb-2">{title}</h4>
        <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-dark">{value}</span>
            <span className="text-green-500 text-sm font-medium">{change}</span>
        </div>
    </motion.div>
);

const OrderRow = ({ id, customer, status, total }) => (
    <tr className="hover:bg-gray-50">
        <td className="py-4 text-dark font-medium">{id}</td>
        <td className="py-4 text-gray-600">{customer}</td>
        <td className="py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                ${status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                {status}
            </span>
        </td>
        <td className="py-4 text-dark font-medium">{total}</td>
    </tr>
);

export default AdminDashboard;
