import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("galleryCart");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Cart data is stored locally so it survives page refreshes before checkout.
  function persist(nextItems) {
    setItems(nextItems);
    localStorage.setItem("galleryCart", JSON.stringify(nextItems));
  }

  function addToCart(artwork) {
    if (!artwork.isAvailable) return;
    const exists = items.some((item) => item._id === artwork._id);
    if (!exists) persist([...items, artwork]);
  }

  function removeFromCart(artworkId) {
    persist(items.filter((item) => item._id !== artworkId));
  }

  function clearCart() {
    persist([]);
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const value = useMemo(
    () => ({
      items,
      total,
      addToCart,
      removeFromCart,
      clearCart
    }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
