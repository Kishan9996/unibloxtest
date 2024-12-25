// import { useEffect, useState } from 'react';
// import {
//   Badge,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Typography,
// } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import useCartStore from '../store/cartStore';

// const CartComponent = () => {
//   const { cart, cartCount, fetchCart } = useCartStore();
//   const [open, setOpen] = useState(false);
//   console.log(cartCount);
//   useEffect(() => {
//     fetchCart(); // Fetch cart items on component mount
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <>
//       <Badge
//         badgeContent={cartCount}
//         color="primary"
//         sx={{
//           '& .MuiBadge-dot': {
//             backgroundColor: '#333', // Dark background color for the badge
//           },
//           '& .MuiBadge-dot': {
//             color: '#fff', // Dark text color
//           },
//         }}
//       >
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
//       </Badge>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Cart Items</DialogTitle>
//         <DialogContent>
//           {cart.length === 0 ? (
//             <Typography>No items in the cart</Typography>
//           ) : (
//             cart.map((item, index) => (
//               <Typography key={item.cartItemId || index}>
//                 {item.product.name} - Quantity: {item.quantity} - Price: $
//                 {item.price}
//               </Typography>
//             ))
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CartComponent;


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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCartStore from '../store/cartStore';

const CartComponent = () => {
  const { cart, cartCount, fetchCart } = useCartStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCart(); // Fetch cart items on component mount
  }, [fetchCart]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
              marginLeft: 0,
              marginTop: -4,
              backgroundColor: '#333', // Dark background color for the badge
              color: '#fff', // White text color for better contrast
            }}
          />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cart Items</DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography>No items in the cart</Typography>
          ) : (
            cart.map((item, index) => (
              <Typography key={item.cartItemId || index}>
                {item.product.name} - Quantity: {item.quantity} - Price: $
                {item.price}
              </Typography>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartComponent;
