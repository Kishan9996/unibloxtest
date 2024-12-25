import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api/product';
import { Grid, Button, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
import Cart from './Cart'; // Import Cart component

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [openCartDialog, setOpenCartDialog] = useState(false); // Manage dialog visibility

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data.data); // Assuming the structure has 'data.data' for products
      } catch (err) {
        setError('Failed to fetch products');
      }
    };
    getProducts();
  }, []);

  // Handle quantity increase
  const handleIncrease = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  // Handle quantity decrease
  const handleDecrease = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  // Open the cart dialog
  const openCartDialogHandler = () => {
    setOpenCartDialog(true);
  };

  // Close the cart dialog
  const closeCartDialogHandler = () => {
    setOpenCartDialog(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleIncrease(product.id)}
                  variant="contained"
                  color="primary"
                >
                  Increase Quantity
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDecrease(product.id)}
                  variant="contained"
                  color="secondary"
                >
                  Decrease Quantity
                </Button>
                <Button
                  size="small"
                  onClick={() => handleAddToCart(product)}
                  variant="outlined"
                  color="success"
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Cart
        cart={cart}
        handleClose={closeCartDialogHandler}
        openDialog={openCartDialogHandler}
        open={openCartDialog} // Pass `open` prop to Cart component
      />
    </Box>
  );
};

export default ProductsPage;
