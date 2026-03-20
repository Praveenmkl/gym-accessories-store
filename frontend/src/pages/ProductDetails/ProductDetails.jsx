import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetails.css';
import { useCart } from '../../context/CartContext';
import api from '../../api/client';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-family="Arial" font-size="24">No image</text></svg>';


const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { id } = useParams(); //to get product id from url
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product || null);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load product details.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;
  const imageSrc = (product.image || '').trim() || FALLBACK_IMAGE;

  const handleAddToCart = () => {
    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} items available in stock`);
      return;
    }
    addToCart({ ...product, id: product._id || product.id }, quantity);
    navigate('/cart');
  };

  return (
    <div className='product-details'>
      <div className='product-image'>
        <img
          src={imageSrc}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <hr className='product-divider' />

        <p className='price'>LKR {product.price.toFixed(2)}</p>
        <p className="description">{product.description || 'High-quality gym accessory built for performance and durability.'}</p>

        <hr className='product-divider' />

        <p className='qty-label'>Quantity (Available: {product.quantity})</p>
        <div className='quantity-selector'>
          <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>&#8722;</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity < product.quantity ? quantity + 1 : quantity)}>+</button>
        </div>

        <button className='add-to-cart' onClick={handleAddToCart}>Add to Cart</button>

        <div className='product-trust'>
          <span>&#10003; Free shipping over Rs 5000</span>
          <span>&#10003; Easy 30-day returns</span>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;