import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

const Header = () => (
  <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 4 }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        My App
      </Typography>
      <Box>
        <Button
          color="secondary"
          variant="outlined"
          component={Link}
          to="/login"
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
          variant="outlined"
          component={Link}
          to="/signup"
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
        <Button
          color="secondary"
          variant="outlined"
          component={Link}
          to="/products"
          sx={{
            marginLeft: 2,
            ':hover': {
              bgcolor: 'secondary.main',
              color: 'white',
            },
          }}
        >
          Products
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
