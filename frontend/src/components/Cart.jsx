// import { useEffect, useState } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
//   Chip,
//   Box,
//   IconButton,
// } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import DeleteIcon from '@mui/icons-material/Delete';
// import useCartStore from '../store/cartStore';
// import { clearCartItemsApi, removeCartItemaApi } from '../services/api/cart';

// const CartComponent = () => {
//   const { cart, cartCount, fetchCart, removeItemFromCart, clearCart, cartChangeCount, cartId } = useCartStore();
//   const [open, setOpen] = useState(false);
//   // Fetch cart items when the component is mounted or when cartCount or cartChangeCount changes
//   useEffect(() => {
//     fetchCart(); // Fetch cart items on component mount or cart updates
//   }, [fetchCart, cartChangeCount]);

//   // Handler to open and close the cart dialog
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Handler to remove item from the cart
//   const handleRemoveItem = async (cartItemId) => {
//     removeItemFromCart(cartItemId);
//     await removeCartItemaApi({ cartItemId });
//   };

//   // Handler to clear the entire cart
//   const handleClearCart = async () => {
//     clearCart();
//     await clearCartItemsApi(cartId)
//   };

//   // Handler for checkout
//   const handleCheckout = () => {
//     alert('Proceeding to checkout!');
//     // Logic to handle checkout can be added here
//   };

//   return (
//     <>
//       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleOpen}
//           startIcon={<ShoppingCartIcon />}
//           sx={{
//             marginLeft: 2,
//           }}
//         >
//           Cart
//         </Button>

//         {/* Cart Count displayed beside the Button */}
//         <Chip
//           label={cartCount}
//           color="primary"
//           size="small"
//           sx={{
//             marginLeft: 1,
//             marginTop: -4,
//             backgroundColor: '#333', // Dark background color for the badge
//             color: '#fff', // White text color for better contrast
//           }}
//         />
//       </Box>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Cart Items</DialogTitle>
//         <DialogContent>
//           {cart.length === 0 ? (
//             <Typography>Cart is empty</Typography>
//           ) : (
//             cart.map((item) => (
//               <Box
//                 key={item.cartItemId}
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 2,
//                 }}
//               >
//                 <Typography>
//                   {item.product.name} - Quantity: {item.quantity} - Price: ${item.price}
//                 </Typography>
//                 <IconButton
//                   onClick={() => handleRemoveItem(item.cartItemId)}
//                   color="error"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>
//             ))
//           )}
//         </DialogContent>
//         <DialogActions>
//           {cart.length > 0 && <>
//             <Button onClick={handleClearCart} color="error">
//               Clear Cart
//             </Button>
//             <Button onClick={handleCheckout} color="primary">
//               Checkout
//             </Button>
//           </>
//           }
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CartComponent;


import { useCallback, useEffect, useState } from 'react';
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
import { clearCartItemsApi, placeOrderCheckout, removeCartItemaApi } from '../services/api/cart';
import { fetchDiscountCodes } from '../services/api/discount';

const CartComponent = () => {
  const { cart, cartCount, fetchCart, removeItemFromCart, clearCart, cartChangeCount, cartId,totalAmount,setTotalAmount } = useCartStore();
  const [open, setOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState('');
  const [discountCodes, setDiscountCodes] = useState([
    { code: 'SAVE10', description: 'Save 10%' },
    { code: 'FREESHIP', description: 'Free Shipping' },
    { code: 'BLACKFRIDAY', description: 'Black Friday 20% Off' },
  ]); // You can replace this with an API call to fetch discount codes

  const fetchDiscountCodeHandler = useCallback(async () => {
    try {
      const response = await fetchDiscountCodes();
      setDiscountCodes(response.data.data);
    } catch (error) {
      console.error('Failed to fetch discount codes:', error);
    }
  },[]);
  useEffect(() => {
    fetchCart(); // Fetch cart items on component mount or cart updates
    fetchDiscountCodeHandler();
  }, [fetchCart, cartChangeCount]);

  // Handler to open and close the cart dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handler to open and close the discount dialog
  const handleDiscountDialogOpen = () => setDiscountDialogOpen(true);
  const handleDiscountDialogClose = () => setDiscountDialogOpen(false);

  // Handler to remove item from the cart
  const handleRemoveItem = async (cartItemId) => {
    removeItemFromCart(cartItemId);
    await removeCartItemaApi({ cartItemId,discountCodeId:selectedDiscountCode,totalAmount:0 });
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

  const managePlaceOrderFlow = async() => {
    setTotalAmount();
    await placeOrderCheckout({ cartId,totalAmount,discountCodeId:selectedDiscountCode });
    fetchCart();
  }
  // Handler for placing the order (final step after selecting a discount code)
  const handlePlaceOrder = async() => {
    await managePlaceOrderFlow();
    handleDiscountDialogClose(); // Close the discount dialog after placing the order
    // Additional logic to process the order can be added here (e.g., API call to place the order)
  };

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
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Discount Code</InputLabel>
            <Select
              value={selectedDiscountCode}
              label="Discount Code"
              onChange={(e) => setSelectedDiscountCode(e.target.value)}
            >
              {discountCodes.map((code) => (
                <MenuItem key={code.code} value={code.code}>
                  {code.description} ({code.code})
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
