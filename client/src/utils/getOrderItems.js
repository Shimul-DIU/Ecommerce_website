const getOrderItems = (order) => {
  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items;
  }

  if (!order?.productSnapshot) return [];

  return [
    {
      ...order.productSnapshot,
      quantity: order.quantity || 1,
    },
  ];
};

export default getOrderItems;
