import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api/product';
import { Grid, Button, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
import { addToCartApi } from '../services/api/cart'; // Import addToCartApi
import useCartStore from '../store/cartStore'; // Import useCartStore

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');
  const { increaseCartChangeCount } = useCartStore(); // Access addToCart function

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data.data); // Assuming the structure has 'data.data' for products

        // Initialize quantities for each product
        const initialQuantities = response.data.data.reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err)
        setError('Failed to fetch products');
      }
    };
    getProducts();
  }, []);

  // Handle quantity increase
  const handleIncrease = (productId, stock) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId];
      if (currentQuantity < stock) {
        return { ...prevQuantities, [productId]: currentQuantity + 1 };
      }
      return prevQuantities;
    });
  };

  // Handle quantity decrease
  const handleDecrease = (productId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId];
      if (currentQuantity > 0) {
        return { ...prevQuantities, [productId]: currentQuantity - 1 };
      }
      return prevQuantities;
    });
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId];
    if (quantity > 0) {
      // Call the API to add the product to the cart
      try {
        await addToCartApi({ productId, quantity });
        increaseCartChangeCount();
        // // Once the API call is successful, update the cart state
        // addToCart(products.find((product) => product.id === productId), quantity);
      } catch (err) {
        console.error(err)
        setError('Failed to add product to the cart');
      }
    }
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
                  Stock: {product.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleDecrease(product.id)}
                  variant="contained"
                  color="secondary"
                  disabled={quantities[product.id] === 0}
                >
                  Decrease
                </Button>
                <Typography sx={{ marginX: 2, alignSelf: 'center' }}>
                  {quantities[product.id]}
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleIncrease(product.id, product.stock)}
                  variant="contained"
                  color="primary"
                  disabled={quantities[product.id] === product.stock}
                >
                  Increase
                </Button>
                <Button
                  size="small"
                  onClick={() => handleAddToCart(product.id)}
                  variant="outlined"
                  color="success"
                  disabled={quantities[product.id] === 0}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
