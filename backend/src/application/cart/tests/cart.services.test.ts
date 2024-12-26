import { CartServices } from "../cart.services";

describe('CartServices', () => {

    // Create new cart for user when no existing cart is found
    it('should create new cart when user has no existing cart', async () => {
      const cartServices = new CartServices();
      const userId = 'test-user-id';
      const mockCart:any = {
        id: 'new-cart-id',
        userId,
        items: [],
        checkedOut: false
      };

      jest.spyOn(cartServices['cartRepository'], 'findCartByUserId')
        .mockResolvedValue(null);

      jest.spyOn(cartServices['cartRepository'], 'createCart')
        .mockResolvedValue(mockCart);

      const result = await cartServices.createCart(userId);

      expect(cartServices['cartRepository'].findCartByUserId)
        .toHaveBeenCalledWith(userId);
      expect(cartServices['cartRepository'].createCart)
        .toHaveBeenCalledWith({
          data: { userId },
          select: {
            items: true,
            id: true, 
            checkedOut: true,
            userId: true
          }
        });
      expect(result).toEqual(mockCart);
    });

    // Prevent adding items that exceed available product stock
    it('should return null when trying to add items exceeding available stock', async () => {
      const cartServices = new CartServices();
      const user = { id: 'user-123' };
      const cartData = { 
        productId: 'product-123',
        quantity: 5
      };
      const existingCart:any = {
        id: 'cart-123',
        items: [{
          productId: 'product-123',
          quantity: 3
        }]
      };
      const product:any = {
        id: 'product-123',
        stock: 6,
        price: 100
      };

      jest.spyOn(cartServices['productService'], 'checkProductsAndQuantityAvailable')
        .mockResolvedValue(product);
      jest.spyOn(cartServices, 'createCart')
        .mockResolvedValue(existingCart);

      const result = await cartServices.addToCart(cartData, user);

      expect(result).toBeNull();
      expect(cartServices['productService'].checkProductsAndQuantityAvailable)
        .toHaveBeenCalledWith(cartData);
      expect(cartServices.createCart)
        .toHaveBeenCalledWith(user.id);
    });
});
