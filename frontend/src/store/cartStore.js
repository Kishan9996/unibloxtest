import { create } from 'zustand';
import { fetchCartItems } from '../services/api/cart';

const useCartStore = create((set) => ({
  cart: [],
  cartCount: 0,
  fetchCart: async () => {
    try {
      const response = await fetchCartItems();
      const { data } = response.data;

      if (data) {
        const formattedCart = data.items.map((item) => ({
          cartItemId: item.cartItemId,
          price: item.price,
          quantity: item.quantity,
          product: item.product,
        }));

        set({ cart: formattedCart });
        set({ cartCount: data.items.length }); // Update cart count
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  },
  setCartCount: (count) => set({ cartCount: count }), // New method to set cart count
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          cartCount: state.cartCount, // Maintain cart count as is
        };
      }
      return {
        cart: [
          ...state.cart,
          { cartItemId: null, price: product.price, quantity: 1, product },
        ],
        cartCount: state.cartCount + 1, // Increment cart count for new item
      };
    }),
  clearCart: () => set({ cart: [], cartCount: 0 }),
}));
export default useCartStore;
