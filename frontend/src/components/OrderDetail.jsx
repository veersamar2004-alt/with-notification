import { useState, useEffect } from 'react';
import { orderApi } from '../api';

export default function OrderDetail({ orderId, onClose, onOrderUpdated, onToast }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Edit form state
    const [editCustomerId, setEditCustomerId] = useState('');
    const [editRestaurantId, setEditRestaurantId] = useState('');
    const [editItems, setEditItems] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await orderApi.getById(orderId);
                setOrder(data);
            } catch (err) {
                onToast(`Failed to load order: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, onToast]);

    const startEditing = () => {
        if (!order) return;
        setEditCustomerId('');
        setEditRestaurantId('');
        setEditItems(
            order.items && order.items.length > 0
                ? order.items.map(i => ({
                    menuItemId: i.menuItemId?.toString() || '',
                    quantity: i.quantity?.toString() || '1',
                    price: i.price?.toString() || '',
                }))
                : [{ menuItemId: '', quantity: '1', price: '' }]
        );
        setEditing(true);
    };

    const addEditItem = () => {
        setEditItems([...editItems, { menuItemId: '', quantity: '1', price: '' }]);
    };

    const removeEditItem = (index) => {
        if (editItems.length <= 1) return;
        setEditItems(editItems.filter((_, i) => i !== index));
    };

    const updateEditItem = (index, field, value) => {
        const updated = [...editItems];
        updated[index] = { ...updated[index], [field]: value };
        setEditItems(updated);
    };

    const handleSave = async () => {
        const validItems = editItems.filter(i => i.menuItemId && i.quantity && i.price);
        if (validItems.length === 0) {
            onToast('Please add at least one valid item', 'error');
            return;
        }

        const orderData = {
            items: validItems.map(i => ({
                menuItemId: parseInt(i.menuItemId),
                quantity: parseInt(i.quantity),
                price: parseFloat(i.price),
            })),
        };

        if (editCustomerId) orderData.customerId = parseInt(editCustomerId);
        if (editRestaurantId) orderData.restaurantId = parseInt(editRestaurantId);

        try {
            setSaving(true);
            const updated = await orderApi.update(orderId, orderData);
            setOrder(updated);
            setEditing(false);
            onToast('Order updated successfully! ✅', 'success');
            if (onOrderUpdated) onOrderUpdated();
        } catch (err) {
            onToast(`Failed to update: ${err.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await orderApi.delete(orderId);
            onToast('Order deleted 🗑️', 'info');
            if (onOrderUpdated) onOrderUpdated();
            onClose();
        } catch (err) {
            onToast(`Failed to delete: ${err.message}`, 'error');
            setDeleting(false);
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

    const editTotal = editItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : !order ? (
                    <div className="empty-state">
                        <div className="empty-icon">❌</div>
                        <h3>Order Not Found</h3>
                        <p>Could not load order #{orderId}</p>
                    </div>
                ) : editing ? (
                    /* ===== EDIT MODE ===== */
                    <>
                        <div className="modal-header">
                            <h2>✏️ Edit Order #{orderId}</h2>
                            <button className="modal-close" onClick={() => setEditing(false)}>✕</button>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Customer ID (optional)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Leave blank to keep current"
                                    value={editCustomerId}
                                    onChange={(e) => setEditCustomerId(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Restaurant ID (optional)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Leave blank to keep current"
                                    value={editRestaurantId}
                                    onChange={(e) => setEditRestaurantId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Items</label>
                            <div className="items-list">
                                {editItems.map((item, index) => (
                                    <div className="item-row" key={index}>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Menu Item ID"
                                            value={item.menuItemId}
                                            onChange={(e) => updateEditItem(index, 'menuItemId', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => updateEditItem(index, 'quantity', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Price"
                                            value={item.price}
                                            onChange={(e) => updateEditItem(index, 'price', e.target.value)}
                                            step="0.01"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-icon"
                                            onClick={() => removeEditItem(index)}
                                            disabled={editItems.length <= 1}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="add-item-btn" onClick={addEditItem}>
                                    + Add Another Item
                                </button>
                            </div>
                        </div>

                        <div className="order-total">
                            <span className="label">New Total</span>
                            <span className="amount">${editTotal.toFixed(2)}</span>
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    </>
                ) : (
                    /* ===== VIEW MODE ===== */
                    <>
                        <div className="modal-header">
                            <h2>📦 Order #{order.orderId}</h2>
                            <button className="modal-close" onClick={onClose}>✕</button>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-label">Status</div>
                                <div className="detail-value">
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Total Amount</div>
                                <div className="detail-value" style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>
                                    ${parseFloat(order.totalAmount || 0).toFixed(2)}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Created At</div>
                                <div className="detail-value" style={{ fontSize: '0.85rem' }}>
                                    {formatDate(order.createdAt)}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="detail-label">Items Count</div>
                                <div className="detail-value">
                                    <span className="item-count">{order.items ? order.items.length : 0}</span>
                                </div>
                            </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <div className="form-label" style={{ marginBottom: 12 }}>Order Items</div>
                                <table className="detail-items-table">
                                    <thead>
                                        <tr>
                                            <th>Menu Item ID</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{item.menuItemId}</td>
                                                <td>{item.quantity}</td>
                                                <td style={{ fontFamily: 'var(--font-mono)' }}>${parseFloat(item.price || 0).toFixed(2)}</td>
                                                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-success)' }}>
                                                    ${(parseFloat(item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : '🗑️ Delete'}
                            </button>
                            <button className="btn btn-primary" onClick={startEditing}>
                                ✏️ Edit Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
