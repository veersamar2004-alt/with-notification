import { useState } from 'react';
import { orderApi } from '../api';

export default function CreateOrder({ onOrderCreated, onToast }) {
    const [customerId, setCustomerId] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [items, setItems] = useState([{ menuItemId: '', quantity: 1, price: '' }]);
    const [submitting, setSubmitting] = useState(false);

    const addItem = () => {
        setItems([...items, { menuItemId: '', quantity: 1, price: '' }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.quantity) || 0;
            return sum + price * qty;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerId || !restaurantId) {
            onToast('Please fill in Customer ID and Restaurant ID', 'error');
            return;
        }

        const validItems = items.filter(i => i.menuItemId && i.quantity && i.price);
        if (validItems.length === 0) {
            onToast('Please add at least one valid item', 'error');
            return;
        }

        const orderData = {
            customerId: parseInt(customerId),
            restaurantId: parseInt(restaurantId),
            items: validItems.map(i => ({
                menuItemId: parseInt(i.menuItemId),
                quantity: parseInt(i.quantity),
                price: parseFloat(i.price),
            })),
        };

        try {
            setSubmitting(true);
            await orderApi.create(orderData);
            onToast('Order created successfully! 🎉', 'success');

            // Reset form
            setCustomerId('');
            setRestaurantId('');
            setItems([{ menuItemId: '', quantity: 1, price: '' }]);

            if (onOrderCreated) onOrderCreated();
        } catch (err) {
            onToast(`Failed to create order: ${err.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="card-title">
                <span>✨</span> Create New Order
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Customer ID</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 101"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Restaurant ID</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 5"
                            value={restaurantId}
                            onChange={(e) => setRestaurantId(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Order Items</label>
                    <div className="items-list">
                        {items.map((item, index) => (
                            <div className="item-row" key={index}>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Menu Item ID"
                                    value={item.menuItemId}
                                    onChange={(e) => updateItem(index, 'menuItemId', e.target.value)}
                                    min="1"
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                    min="1"
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-icon"
                                    onClick={() => removeItem(index)}
                                    disabled={items.length <= 1}
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" className="add-item-btn" onClick={addItem}>
                            + Add Another Item
                        </button>
                    </div>
                </div>

                <div className="order-total">
                    <span className="label">Estimated Total</span>
                    <span className="amount">${calculateTotal().toFixed(2)}</span>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setCustomerId('');
                            setRestaurantId('');
                            setItems([{ menuItemId: '', quantity: 1, price: '' }]);
                        }}
                    >
                        Clear
                    </button>
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                        {submitting ? (
                            <>
                                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                                Creating...
                            </>
                        ) : (
                            '🚀 Place Order'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
