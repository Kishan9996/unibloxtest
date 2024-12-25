import { Button, Badge, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const Cart = ({ cart, handleClose, open }) => {
  return (
    <>
      <Badge badgeContent={cart.length} color="primary">
        <Button variant="contained" color="secondary" onClick={open}>
          View Cart
        </Button>
      </Badge>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cart Items</DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography>No items in the cart</Typography>
          ) : (
            cart.map((item, index) => (
              <Typography key={index}>
                {item.name} - Quantity: {item.quantity} - Price: ${item.price}
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

export default Cart;
