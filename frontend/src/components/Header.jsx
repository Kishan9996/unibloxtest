import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import CartComponent from './Cart';
import { useContext } from 'react';
import { AuthContext } from './Auth/Auth';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          My App
        </Typography>
        <Box>

          {!currentUser?.isLoggedIn && <Button
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
          </Button>}

          {!currentUser?.isLoggedIn && <Button
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
          </Button>}


          {currentUser.isLoggedIn && <CartComponent />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
