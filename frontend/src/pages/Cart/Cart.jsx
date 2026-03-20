import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';
import { useCart } from '../../context/CartContext';


const Cart = () => {
  const {
    cartItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className='cart-page'>
        <h2 className='cart-title'>SHOPPING CART</h2>
        <div className='empty-cart'>
          <p>Your cart is empty.</p>
          <Link to='/products' className='continue'>Start Shopping</Link>
        </div>
      </div>
    );
  }


  return (
    <div className='cart-page'>

      <h2 className="cart-title">SHOPPING CART</h2>

      <div className="cart-layout">
        {/*LEFT SIDE*/}
        <div className="cart-items">

          {cartItems.map((item) => (
            <div className="cart-card" key={item.id}>

              <img src={item.image} alt={item.name} />

              <div className='cart-details'>
                <h4>{item.name}</h4>
                <p>LKR {item.price.toFixed(2)}</p>
              </div>


              <div className='cart-quantity'>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>

              <div className='cart-price'>
                LKR {(item.price * item.quantity).toFixed(2)}
              </div>

              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>X</button>

            </div>
          ))}

        </div>
        {/*RIGHT SIDE*/}
        <div className="order-summary">
          <h3>ORDER SUMMARY</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>

          <Link to='/checkout' className="checkout-btn">
            PROCEED TO CHECKOUT
          </Link>

          <Link to='/products' className="continue">Continue Shopping</Link>
        </div>
      </div>

    </div>
  )
}

export default Cart