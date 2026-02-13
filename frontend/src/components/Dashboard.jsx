import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '../api';

export default function Dashboard({ onViewOrder }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await orderApi.getAll();
            setOrders(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
    const createdCount = orders.filter(o => o.status === 'CREATED').length;
    const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

    const formatDate = (timestamp) => {
        if (!timestamp) return '—';
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s.includes('creat')) return 'created';
        if (s.includes('prepar')) return 'preparing';
        if (s.includes('ready')) return 'ready';
        if (s.includes('deliver')) return 'delivered';
        if (s.includes('cancel')) return 'cancelled';
        return 'created';
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card">
                <div className="empty-state">
                    <div className="empty-icon">⚠️</div>
                    <h3>Connection Error</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchOrders} style={{ marginTop: 16 }}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-value">{orders.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">${totalRevenue.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active (Created)</div>
                    <div className="stat-value">{createdCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Delivered</div>
                    <div className="stat-value">{deliveredCount}</div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card">
                <div className="card-title">
                    <span>📋</span> All Orders
                    <button className="btn btn-secondary btn-sm" onClick={fetchOrders} style={{ marginLeft: 'auto' }}>
                        ↻ Refresh
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Orders Yet</h3>
                        <p>Create your first order using the "New Order" tab to get started.</p>
                    </div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Items</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId} onClick={() => onViewOrder(order.orderId)}>
                                    <td>
                                        <span className="order-id">#{order.orderId}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="order-amount">${parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                                    </td>
                                    <td>
                                        <span className="item-count">{order.items ? order.items.length : 0}</span>
                                    </td>
                                    <td>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onViewOrder(order.orderId); }}>
                                            View →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
