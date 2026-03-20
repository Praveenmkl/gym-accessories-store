import React from 'react';
import { Link } from 'react-router-dom';
import "./ProductCard.css";
import { useCart } from '../../context/CartContext';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-family="Arial" font-size="24">No image</text></svg>';


const ProductCard = ({product}) => {
  const { addToCart } = useCart();
  const productId = product._id || product.id;
  const imageSrc = (product.image || '').trim() || FALLBACK_IMAGE;

  const handleAddToCart = (event) => {
    event.preventDefault();
    if (product.quantity <= 0) {
      alert("Out of stock");
      return;
    }
    addToCart({ ...product, id: productId }, 1);
  };

  return (
    <Link to={`/product/${productId}`} className='product-card'>
        <img src={imageSrc}
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
        alt={product.name} 
        className='product-image'
        />

        <h3 className='product-name'>{product.name}</h3>
    <h3 className='product-price'>LKR {product.price.toFixed(2)}</h3>

        <button 
          className='add-btn' 
          onClick={handleAddToCart}
          disabled={product.quantity <= 0}
          style={{ opacity: product.quantity <= 0 ? 0.5 : 1, cursor: product.quantity <= 0 ? 'not-allowed' : 'pointer' }}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

    </Link>
  )
}

export default ProductCard