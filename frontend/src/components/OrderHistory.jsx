import { useState } from 'react';
import { orderApi } from '../api';

export default function OrderHistory({ onViewOrder, onToast }) {
    const [customerId, setCustomerId] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!customerId) {
            onToast('Please enter a Customer ID', 'error');
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            const data = await orderApi.getHistory(parseInt(customerId));
            setOrders(data || []);
            if (data && data.length === 0) {
                onToast('No orders found for this customer', 'info');
            }
        } catch (err) {
            onToast(`Search failed: ${err.message}`, 'error');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

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

    const totalSpent = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

    return (
        <div>
            {/* Search Bar */}
            <div className="glass-card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card-title">
                    <span>🔍</span> Customer Order History
                </div>
                <form onSubmit={handleSearch}>
                    <div className="search-bar">
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter Customer ID (e.g. 101)"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            min="1"
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : '🔎 Search'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : searched && orders.length > 0 ? (
                <>
                    {/* Summary Stats */}
                    <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div className="stat-card">
                            <div className="stat-label">Customer #{customerId}</div>
                            <div className="stat-value">{orders.length} Orders</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Total Spent</div>
                            <div className="stat-value">${totalSpent.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="glass-card">
                        <div className="card-title">
                            <span>📜</span> Order Timeline
                        </div>
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Items</th>
                                    <th>Date</th>
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
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={(e) => { e.stopPropagation(); onViewOrder(order.orderId); }}
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : searched ? (
                <div className="glass-card">
                    <div className="empty-state">
                        <div className="empty-icon">🍽️</div>
                        <h3>No Orders Found</h3>
                        <p>Customer #{customerId} has no order history yet.</p>
                    </div>
                </div>
            ) : (
                <div className="glass-card">
                    <div className="empty-state">
                        <div className="empty-icon">👆</div>
                        <h3>Search for Orders</h3>
                        <p>Enter a Customer ID above to view their complete order history and spending summary.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
