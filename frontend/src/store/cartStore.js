import { create } from "zustand";
import { fetchCartItems } from "../services/api/cart";
import { fetchDiscountCodes } from "../services/api/discount";

const useCartStore = create((set) => ({
  cart: [],
  cartCount: 0,
  cartId: null,
  totalAmount: 0,
  discountCodes: [],
  setTotalAmount: () =>
    set((state) => ({
      totalAmount: state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    })),
  cartChangeCount: 0,
  increaseCartChangeCount: () =>
    set((state) => ({ cartChangeCount: state.cartChangeCount + 1 })),
  fetchCart: async () => {
    try {
      const response = await fetchCartItems();
      const { data } = response.data;
      if (data) {
        const formattedCart = data.items.map((item) => ({
          cartId: data.id,
          cartItemId: item.id,
          price: item.price,
          quantity: item.quantity,
          product: item.product,
        }));

        set({
          cart: formattedCart,
          cartCount: data.items.length,
          cartId: data.id,
        }); // Update both cart and count
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  },
  fetchDiscountCodeHandler: async () => {
    const response = await fetchDiscountCodes();
    set({ discountCodes: response.data.data });
  },
  addToCart: (product, quantity) =>
    set((state) => {
      // Assuming adding the item to the cart or updating the quantity
      const existingProduct = state.cart.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          cartCount: state.cart.filter((item) => item.product.id === product.id)
            .length,
        };
      }
      return {
        cart: [
          ...state.cart,
          { cartItemId: null, price: product.price, quantity, product },
        ],
        cartCount: state.cart.length + 1, // Increment cartCount when adding new item
      };
    }),
  // Remove item from cart
  removeItemFromCart: (cartItemId) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => item.cartItemId !== cartItemId
      );
      return {
        cart: updatedCart,
        cartCount: updatedCart.length, // Update the cartCount
      };
    }),
  clearCart: () => set({ cart: [], cartCount: 0 }),
}));

export default useCartStore;
