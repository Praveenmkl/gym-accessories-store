import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="20">No Image Available</text></svg>';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const productId = product._id || product.id;
  const imageSrc = (product.image || '').trim() || FALLBACK_IMAGE;
  const isOutOfStock = product.quantity <= 0;
  const [added, setAdded] = useState(false);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    const success = addToCart({ ...product, id: productId }, 1);
    if (success !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className='group relative flex flex-col bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all duration-300 h-full'>
      <Link to={`/product/${productId}`} className="flex flex-col flex-1">
        {/* Image Container */}
        <div className='relative aspect-square w-full bg-[#f8f8f8] p-6 flex items-center justify-center overflow-hidden border-b border-neutral-100'>
          <img 
            src={imageSrc}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            alt={product.name} 
            className={`h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${
              isOutOfStock ? 'opacity-60 grayscale-[25%]' : ''
            }`}
          />

          {/* Out of Stock Badge ONLY */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3">
              <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex flex-col flex-1 p-5'>
          {product.category && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 block">
              {product.category}
            </span>
          )}

          <h3 className='font-semibold text-neutral-900 text-base leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors'>
            {product.name}
          </h3>

          <div className='mt-auto pt-3'>
            <span className='text-base font-bold text-neutral-900 tracking-tight'>
              LKR {product.price ? product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </span>
          </div>
        </div>
      </Link>

      {/* Button footer */}
      <div className="p-5 pt-0">
        <Button 
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full h-11 rounded-none font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
            isOutOfStock 
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200 shadow-none' 
              : added
              ? 'bg-neutral-900 text-white border border-neutral-900'
              : 'bg-black hover:bg-neutral-800 text-white border border-black shadow-none active:scale-[0.98]'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : added ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;