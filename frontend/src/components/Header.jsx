import { AppBar, Toolbar, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CartComponent from './Cart';
import { useCallback, useContext } from 'react';
import { AuthContext } from './Auth/Auth';
import useCartStore from '../store/cartStore';
import useSnackbarStore from '../store/notificationStore';
import { applyForDiscountCode } from '../services/api/discount';

const Header = () => {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const { currentUser } = useContext(AuthContext);
  const { discountCodes, fetchDiscountCodeHandler } = useCartStore();

  // Handler for applying a discount code
  const handleApplyDiscount = useCallback(async () => {
    try {
      const { data } = await applyForDiscountCode();
      if (data.success) {

        showSnackbar("SuccessFully Applied for discount code")
      } else {
        showSnackbar("Failed to Applied for discount code")
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to Applied for discount code")

    }
  }, [showSnackbar])

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          My App

          {/* Dropdown for Discount Codes */}
          <FormControl
            sx={{ marginLeft: 3, minWidth: 150 }}
            size="small"
            color="secondary"
          >
            <InputLabel id="discount-code-label">Discount Codes</InputLabel>
            <Select
              labelId="discount-code-label"
              label="Discount Codes"
              onOpen={async () => {
                if (!discountCodes.length) {
                  fetchDiscountCodeHandler();
                }
              }}
            >
              {discountCodes.map((code) => (
                <MenuItem key={code.code} value={code.code}>
                  {code.description} ({code.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Apply Discount Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleApplyDiscount}
            sx={{
              marginLeft: 2,
              textTransform: 'none',
              ':hover': {
                bgcolor: 'secondary.main',
                color: 'white',
              },
            }}
          >
            Apply For Discount Code
          </Button>
        </Typography>

        <Box>
          {!currentUser?.isLoggedIn && (
            <>
              <Button
                color="secondary"
                variant="contained"
                component="a"
                href="/login"
                sx={{
                  marginLeft: 2,
                  ':hover': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                  },
                }}
              >
                Login
              </Button>

              <Button
                color="secondary"
                variant="contained"
                component="a"
                href="/signup"
                sx={{
                  marginLeft: 2,
                  ':hover': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}

          {currentUser?.isLoggedIn && <CartComponent />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
