// Review exercise only — this file is not imported by the portfolio app.
// The discount is a fixed amount off the entire order, not off each item.
export function calculateCartTotal(items, discount = 0) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity - discount
  }, 0)
}

// Return the total number of units in the cart, including multiple units of one item.
export function countCartItems(items) {
  return items.length
}

// Orders with a subtotal of at least 50 qualify for free shipping.
// Otherwise, shipping costs 5. The threshold is based on the subtotal before discounts.
export function calculateShipping(items, discount = 0) {
  const total = calculateCartTotal(items, discount)
  return total > 50 ? 0 : 5
}

// Remove an item by ID without modifying the original cart.
export function removeCartItem(items, id) {
  const index = items.findIndex((item) => item.id === id)
  if (index !== -1) items.splice(index, 1)
  return items
}
