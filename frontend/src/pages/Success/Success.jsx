import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import "./Success.css";

export default function Success() {
  const location = useLocation();
  const { order, customer, paymentMethod, total } = location.state || {};

  return (
    <section className="success-page">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce-short" />
        </div>

        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for choosing PowerFit Gym Gear. We have received your order and are preparing it for shipment.
        </p>

        {order?._id && (
          <div className="order-badge">
            <span>Order Reference:</span> <strong>#{order._id}</strong>
          </div>
        )}

        {customer && (
          <div className="order-details-box">
            <div className="detail-item">
              <span className="detail-label">Recipient:</span>
              <span className="detail-val">{customer.name} ({customer.phone})</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deliver To:</span>
              <span className="detail-val">{customer.address}, {customer.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-val">{paymentMethod || order?.paymentMethod || "Card Payment"}</span>
            </div>
            {total && (
              <div className="detail-item total-item">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-val font-bold">LKR {Number(total).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        )}

        <div className="success-actions">
          <Link to="/myorders" className="w-full sm:w-auto">
            <Button className="w-full bg-black hover:bg-neutral-800 text-white rounded-none px-6 py-5 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              View My Orders
            </Button>
          </Link>

          <Link to="/products" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-neutral-300 hover:bg-neutral-100 rounded-none px-6 py-5 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
