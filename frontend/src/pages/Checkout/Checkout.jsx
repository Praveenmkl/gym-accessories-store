import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Mock Card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.name && !form.name) {
      setForm((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const total = subtotal;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!form.phone.trim() || form.phone.trim().length < 7) {
      setErrorMessage("Please enter a valid phone number (at least 7 digits).");
      return;
    }
    if (!form.address.trim()) {
      setErrorMessage("Please enter your delivery street address.");
      return;
    }
    if (!form.city.trim()) {
      setErrorMessage("Please enter your city.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Order & Reserve Stock in backend
      const orderRes = await api.post("/orders", {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
        items: cartItems.map((item) => ({
          id: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        })),
        total,
        paymentMethod,
      });

      const createdOrder = orderRes.data.order;

      // Step 2: If Card payment, simulate payment confirmation
      if (paymentMethod === "Mock Card") {
        await api.post(`/orders/${createdOrder._id}/pay`);
      }

      // Step 3: Clear cart and navigate to success page
      clearCart();
      navigate("/success", {
        state: {
          order: createdOrder,
          customer: form,
          paymentMethod,
          total,
        },
      });
    } catch (err) {
      console.error("Order error:", err);
      const serverMsg =
        err.response?.data?.msg ||
        (err.response?.status === 401
          ? "Session expired or unauthorized. Please log in again."
          : "Failed to place order. Please try again.");
      setErrorMessage(serverMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-neutral-500 mb-6 text-sm">
          Looks like you haven't added any gear to your cart yet.
        </p>
        <Link to="/products">
          <Button className="bg-black hover:bg-neutral-800 text-white rounded-none px-6 py-2 uppercase font-semibold text-xs tracking-wider">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-neutral-900">
            SECURE CHECKOUT
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-none">
          <ShieldCheck className="w-4 h-4" />
          <span>SSL Encrypted Checkout</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Information Card */}
            <Card className="rounded-none border-neutral-200 shadow-none">
              <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-4">
                <CardTitle className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  Shipping & Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="rounded-none border-neutral-300 focus-visible:ring-black h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="rounded-none border-neutral-300 focus-visible:ring-black h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Delivery Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street name, house / apartment number"
                    value={form.address}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="rounded-none border-neutral-300 focus-visible:ring-black h-11"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    City / District *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g. Colombo, Kandy, Galle"
                    value={form.city}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="rounded-none border-neutral-300 focus-visible:ring-black h-11"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="rounded-none border-neutral-200 shadow-none">
              <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-4">
                <CardTitle className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {/* Option 1: Mock Card */}
                <label
                  className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                    paymentMethod === "Mock Card"
                      ? "border-black bg-neutral-50 ring-1 ring-black"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Mock Card"
                    checked={paymentMethod === "Mock Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-700" />
                        Credit / Debit Card (Instant Checkout)
                      </span>
                      <span className="text-[10px] bg-neutral-900 text-white font-bold px-2 py-0.5 uppercase tracking-wider">
                        Fast & Secure
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Simulated instant payment gateway for demonstration.
                    </p>
                  </div>
                </label>

                {/* Option 2: COD */}
                <label
                  className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-black bg-neutral-50 ring-1 ring-black"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-neutral-700" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 uppercase tracking-wider">
                        Pay on Arrival
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Pay cash when your package is delivered to your doorstep.
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <Card className="rounded-none border-neutral-200 shadow-none sticky top-24">
              <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-4">
                <CardTitle className="text-base font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-normal text-neutral-500 lowercase">
                    ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Items List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-6 divide-y divide-neutral-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-neutral-100 p-1 border border-neutral-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} × LKR {item.price ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-neutral-900 flex-shrink-0">
                        LKR {(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      LKR {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">
                      FREE DELIVERY
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-300 mt-4 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-black uppercase tracking-wider text-neutral-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-black text-neutral-900">
                      LKR {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Includes all local taxes and standard delivery charges.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase rounded-none transition-all shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      PROCESSING ORDER...
                    </>
                  ) : paymentMethod === "Mock Card" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      PLACE ORDER & PAY NOW
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      CONFIRM COD ORDER
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Guaranteed Safe & Secure Checkout
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}