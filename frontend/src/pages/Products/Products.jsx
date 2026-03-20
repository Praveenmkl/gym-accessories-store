import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../api/client';
import './Products.css';


const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/products');
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='shop-container'>

      <h1>OUR PRODUCTS</h1>
      <p className='shop-subtitle'>
        Discover premium fitness essentials designed for every workout.
      </p>

      <div className='product-grid'>
        {loading ? <p>Loading products...</p> : null}
        {error ? <p>{error}</p> : null}
        {!loading && !error
          ? products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          : null}
      </div>
      
   
    </div>
  );
};

export default Product;