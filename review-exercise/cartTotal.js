// Review exercise only — this file is not imported by the portfolio app.
// The discount is a fixed amount off the entire order, not off each item.
export function calculateCartTotal(items, discount = 0) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity - discount
  }, 0)
}
