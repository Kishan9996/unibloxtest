import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api/product';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetchProducts();
        console.log(response.data.data);
        
        setProducts(response.data.data);
      } catch (err) {
        setError('Failed to fetch products');
      }
    };
    getProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
