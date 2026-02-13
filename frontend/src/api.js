const BASE_URL = 'http://localhost:8081';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // DELETE returns 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ===== ORDER API =====

export const orderApi = {
  // GET /orders — list all orders
  getAll: () => request('/orders'),

  // GET /orders/:id — get single order
  getById: (orderId) => request(`/orders/${orderId}`),

  // POST /orders — create new order
  create: (orderData) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // PUT /orders/:id — update order
  update: (orderId, orderData) =>
    request(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),

  // DELETE /orders/:id — delete order
  delete: (orderId) =>
    request(`/orders/${orderId}`, {
      method: 'DELETE',
    }),

  // GET /orders/history/:customerId — order history
  getHistory: (customerId) => request(`/orders/history/${customerId}`),
};
