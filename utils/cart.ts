export const getCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const addToCart = (itemId, startDate, endDate) => {
  const cart = getCart();

  // Each cart item has: id, startDate, endDate
  const newItem = { itemId, startDate, endDate };

  cart.push(newItem);

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (
  itemId: string,
  startDate: string,
  endDate: string,
) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const updatedCart = cart.filter(
    (item: any) =>
      !(
        item.itemId === itemId &&
        item.startDate === startDate &&
        item.endDate === endDate
      ),
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
};
