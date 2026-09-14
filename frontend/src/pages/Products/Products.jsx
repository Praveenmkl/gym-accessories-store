import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../api/client';
import './Products.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (inStock) params.append('inStock', 'true');

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Initial load

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    
    setLoading(true);
    api.get('/products')
      .then(({ data }) => setProducts(data.products || []))
      .catch(err => setError(err.response?.data?.msg || 'Failed to load products.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className='shop-container'>
      <h1>OUR PRODUCTS</h1>
      <p className='shop-subtitle'>
        Discover premium fitness essentials designed for every workout.
      </p>

      <div className='shop-layout'>
        {/* Sidebar Filters */}
        <aside className='filters-sidebar'>
          <h3>Filters</h3>
          <form onSubmit={handleApplyFilters}>
            <div className='filter-group'>
              <label>Search</label>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className='filter-group'>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Equipment">Equipment</option>
                <option value="Supplements">Supplements</option>
                <option value="Apparel">Apparel</option>
              </select>
            </div>

            <div className='filter-group price-range'>
              <label>Price Range</label>
              <div className='price-inputs'>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className='filter-group checkbox-group'>
              <input 
                type="checkbox" 
                id="inStock"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <label htmlFor="inStock">In Stock Only</label>
            </div>

            <div className='filter-actions'>
              <button type="submit" className='btn-apply'>Apply</button>
              <button type="button" className='btn-reset' onClick={handleResetFilters}>Reset</button>
            </div>
          </form>
        </aside>

        {/* Product Grid */}
        <div className='product-grid'>
          {loading ? <p>Loading products...</p> : null}
          {error ? <p className="error-msg">{error}</p> : null}
          {!loading && !error && products.length === 0 ? <p>No products match your filters.</p> : null}
          {!loading && !error && products.length > 0
            ? products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default Product;