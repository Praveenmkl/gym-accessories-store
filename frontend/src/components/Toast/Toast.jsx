import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, AlertCircle, X, ShoppingBag } from 'lucide-react';

const Toast = () => {
  const { toastNotification, hideNotification } = useCart();

  if (!toastNotification || !toastNotification.show) return null;

  const isSuccess = toastNotification.type === 'success';
  const product = toastNotification.product;

  return (
    <div 
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-white border-2 border-black shadow-2xl p-4 transition-all duration-300 transform translate-y-0"
      role="alert"
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <div className="w-8 h-8 rounded-none bg-black text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-none bg-red-600 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">
              {isSuccess ? 'Added to Cart' : 'Notice'}
            </h4>
            <button
              onClick={hideNotification}
              className="text-neutral-400 hover:text-black transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-semibold text-neutral-900 mt-1 line-clamp-1">
            {toastNotification.message || product?.name}
          </p>

          {isSuccess && product && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-contain bg-neutral-50 border border-neutral-200 p-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500">
                  Qty: <span className="font-semibold text-black">{toastNotification.quantity || 1}</span>
                </p>
                <p className="text-xs font-bold text-black">
                  LKR {product.price ? (product.price * (toastNotification.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>

              <Link
                to="/cart"
                onClick={hideNotification}
                className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-2 flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3 h-3" />
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
