// import supertest from 'supertest';
// import express from 'express';
// import { CartController } from '../cart.controller';
// import { ApplicationNames, HttpStatusCodes } from '../../../const/constant';
// import { CartServices } from '../../../application/cart';
// import { authenticationMiddleware } from '../../../infrastructure/middlewares/authMiddleware';

// // Create an Express app instance for testing
// const app = express();

// // Mocking the CartServices
// jest.mock('../../../application/cart');
// const mockedCartServices = CartServices as jest.Mocked<typeof CartServices>;

// // Mocking the authentication middleware
// jest.mock('../../../infrastructure/middlewares/authMiddleware', () => ({
//   authenticationMiddleware: jest.fn((req, res, next) => next()), // Simulate the authentication middleware
// }));

// // Initialize CartController and add routes
// const cartController = new CartController();
// app.use(cartController.router);

// describe('CartController API tests', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should add an item to the cart successfully', async () => {
//     const mockAddToCart = jest.fn().mockResolvedValue(true);
//     mockedCartServices.prototype.addToCart = mockAddToCart;

//     const response = await supertest(app)
//       .post('/add')
//       .send({ productId: 1, quantity: 2 })
//       .set('Authorization', 'Bearer valid-token'); // Assuming valid token is used for authentication

//     expect(response.status).toBe(HttpStatusCodes.STATUS_OK.value);
//     expect(response.body.message).toBe('Cart item created successfully');
//     expect(mockAddToCart).toHaveBeenCalledWith(
//       { productId: 1, quantity: 2 },
//       expect.any(Object) // user object will be passed from middleware
//     );
//   });

//   it('should return an error when adding an item to the cart fails', async () => {
//     const mockAddToCart = jest.fn().mockResolvedValue(false);
//     mockedCartServices.prototype.addToCart = mockAddToCart;

//     const response = await supertest(app)
//       .post('/add')
//       .send({ productId: 1, quantity: 2 })
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_BAD_REQUEST.value);
//     expect(response.body.message).toBe('Failed to create cart item');
//     expect(mockAddToCart).toHaveBeenCalledWith(
//       { productId: 1, quantity: 2 },
//       expect.any(Object)
//     );
//   });

//   it('should remove an item from the cart successfully', async () => {
//     const mockRemoveFromCart = jest.fn().mockResolvedValue(true);
//     mockedCartServices.prototype.removeToCart = mockRemoveFromCart;

//     const response = await supertest(app)
//       .post('/remove-item')
//       .send({ cartItemId: 1 })
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_OK.value);
//     expect(response.body.message).toBe('Cart item removed successfully');
//     expect(mockRemoveFromCart).toHaveBeenCalledWith(
//       { cartItemId: 1 },
//       expect.any(Object)
//     );
//   });

//   it('should return an error when removing an item from the cart fails', async () => {
//     const mockRemoveFromCart = jest.fn().mockResolvedValue(false);
//     mockedCartServices.prototype.removeToCart = mockRemoveFromCart;

//     const response = await supertest(app)
//       .post('/remove-item')
//       .send({ cartItemId: 1 })
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_BAD_REQUEST.value);
//     expect(response.body.message).toBe('Failed to remove cart item');
//   });

//   it('should get cart items successfully', async () => {
//     const mockGetCartWithItems = jest.fn().mockResolvedValue([{ productId: 1, quantity: 2 }]);
//     mockedCartServices.prototype.getCartWithItems = mockGetCartWithItems;

//     const response = await supertest(app)
//       .get('/cart-items')
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_OK.value);
//     expect(response.body.data).toEqual([{ productId: 1, quantity: 2 }]);
//     expect(mockGetCartWithItems).toHaveBeenCalledWith(expect.any(Object));
//   });

//   it('should check out the cart successfully', async () => {
//     const mockCheckout = jest.fn().mockResolvedValue(true);
//     mockedCartServices.prototype.checkoutCart = mockCheckout;

//     const response = await supertest(app)
//       .post('/checkout')
//       .send({ paymentDetails: 'valid-payment' })
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_OK.value);
//     expect(response.body.message).toBe('Checkout successful');
//     expect(mockCheckout).toHaveBeenCalledWith(
//       { paymentDetails: 'valid-payment' },
//       expect.any(Object)
//     );
//   });

//   it('should clear cart successfully', async () => {
//     const mockClearCartItems = jest.fn().mockResolvedValue(true);
//     mockedCartServices.prototype.clearCartItems = mockClearCartItems;

//     const response = await supertest(app)
//       .get('/clear-cart/1')
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_OK.value);
//     expect(response.body.message).toBe('Cart cleared successfully');
//     expect(mockClearCartItems).toHaveBeenCalledWith('1', expect.any(String)); // Assuming user ID is passed in middleware
//   });

//   it('should return error for clear cart if fails', async () => {
//     const mockClearCartItems = jest.fn().mockResolvedValue(false);
//     mockedCartServices.prototype.clearCartItems = mockClearCartItems;

//     const response = await supertest(app)
//       .get('/clear-cart/1')
//       .set('Authorization', 'Bearer valid-token');

//     expect(response.status).toBe(HttpStatusCodes.STATUS_BAD_REQUEST.value);
//     expect(response.body.message).toBe('Failed to clear cart');
//   });
// });
