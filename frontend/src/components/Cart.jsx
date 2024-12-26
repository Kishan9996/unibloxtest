import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Chip,
  Box,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import useCartStore from '../store/cartStore';
import { clearCartItemsApi, placeOrderCheckout, removeCartItemApi } from '../services/api/cart';

const CartComponent = () => {
  const { cart, cartCount, fetchCart, removeItemFromCart, clearCart, cartChangeCount, cartId, totalAmount, fetchDiscountCodeHandler, discountCodes } = useCartStore();
  const [open, setOpen] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(totalAmount);

  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState('');

  useEffect(() => {
    fetchCart(); // Fetch cart items on component mount or cart updates
    fetchDiscountCodeHandler();
  }, [fetchCart, cartChangeCount, fetchDiscountCodeHandler,setDiscountedAmount]);

  // Handler to open and close the cart dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handler to open and close the discount dialog
  const handleDiscountDialogOpen = () => setDiscountDialogOpen(true);
  const handleDiscountDialogClose = () => setDiscountDialogOpen(false);

  // Handler to remove item from the cart
  const handleRemoveItem = async (cartItemId) => {
    removeItemFromCart(cartItemId);
    await removeCartItemApi({ cartItemId, discountCodeId: selectedDiscountCode, totalAmount: 0 });
  };

  // Handler to clear the entire cart
  const handleClearCart = async () => {
    clearCart();
    await clearCartItemsApi(cartId);
  };

  // Handler for checkout (opens the discount code dialog)
  const handleCheckout = () => {
    handleDiscountDialogOpen(); // Open discount code dialog when checkout is clicked
  };

  const managePlaceOrderFlow = async () => {
    await placeOrderCheckout({ cartId, totalAmount, discountCodeId: selectedDiscountCode });
    handleDiscountDialogClose(); // Close the discount dialog after placing the order
  }
  // Handler for placing the order (final step after selecting a discount code)
  const handlePlaceOrder = async () => {
    await managePlaceOrderFlow();
    window.location.reload();
    // Additional logic to process the order can be added here (e.g., API call to place the order)
  };

  const handleSelectDiscount = (e) => {
    setSelectedDiscountCode(e.target.value)
    const discount = discountCodes.find(item=>item.id===e.target.value)
    const discountAmount = totalAmount * (discount.discountValue / 100);
    const discountedPrice = totalAmount - discountAmount;
    setDiscountedAmount(discountedPrice)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpen}
          startIcon={<ShoppingCartIcon />}
          sx={{
            marginLeft: 2,
          }}
        >
          Cart
        </Button>

        {/* Cart Count displayed beside the Button */}
        <Chip
          label={cartCount}
          color="primary"
          size="small"
          sx={{
            marginLeft: 1,
            marginTop: -4,
            backgroundColor: '#333', // Dark background color for the badge
            color: '#fff', // White text color for better contrast
          }}
        />
      </Box>

      {/* Cart Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cart Items</DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography>Cart is empty</Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item.cartItemId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <Typography>
                  {item.product.name} - Quantity: {item.quantity} - Price: ${item.price}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveItem(item.cartItemId)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          {cart.length > 0 && <>
            <Button onClick={handleClearCart} color="error">
              Clear Cart
            </Button>
            <Button onClick={handleCheckout} color="primary">
              Checkout
            </Button>
          </>
          }
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discount Code Dialog */}
      <Dialog open={discountDialogOpen} onClose={handleDiscountDialogClose}>
        <DialogTitle>Apply Discount Code</DialogTitle>
        <DialogTitle>Total Amount : {totalAmount}</DialogTitle>
        {discountedAmount !== totalAmount && <DialogTitle>Discounted Amount : {discountedAmount}</DialogTitle>}

        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Discount Code</InputLabel>
            <Select
              value={selectedDiscountCode}
              label="Discount Code"
              onChange={(e) => handleSelectDiscount(e)}
            >
              {discountCodes.map((code) => (
                <MenuItem key={code.id} value={code.id}>
                  {code.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscountDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder} color="primary">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartComponent;
