import { useState } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../api/client";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });

  const total = subtotal;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      alert("Please fill all shipping details");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      await api.post("/orders", {
        customer: form,
        items: cartItems,
        total,
        paymentMethod: "COD"
      });

      alert("Order Placed!");
      clearCart();
      navigate("/success");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error placing order");
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">CHECKOUT</h2>

      <div className="checkout-layout">
        <section className="checkout-form-card">
          <h3>Shipping Details</h3>

          <div className="checkout-form-grid">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              placeholder="Street and house number"
              value={form.address}
              onChange={handleChange}
              required
            />

            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              placeholder="Enter city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <aside className="checkout-summary-card">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p className="checkout-empty">Your cart is empty.</p>
          ) : (
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x Rs. {item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <hr />

          <div className="checkout-total-row">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>

          <button className="place-order-btn" onClick={placeOrder}>
            PLACE ORDER (CASH ON DELIVERY)
          </button>
        </aside>
      </div>
    </div>
  );
}