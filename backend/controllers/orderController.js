import Order from "../models/Order.js";
import ShippingDetail from "../models/ShippingDetail.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const isValidNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const createOrder = async (req, res) => {
  const decrementedProducts = [];

  try {
    const { customer, items, total, paymentMethod } = req.body;
    const userId = req.user?.id || null;

    if (!customer || typeof customer !== "object") {
      return res.status(400).json({ msg: "Customer details are required" });
    }

    const requiredCustomerFields = ["name", "phone", "address", "city"];
    for (const field of requiredCustomerFields) {
      if (!String(customer[field] || "").trim()) {
        return res.status(400).json({ msg: `Customer ${field} is required` });
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Order items are required" });
    }

    const normalizedItems = items.map((item) => ({
      productId: String(item.id || item._id || item.productId || "").trim(),
      name: String(item.name || "").trim(),
      price: isValidNumber(item.price),
      quantity: Number(item.quantity),
      image: String(item.image || "").trim(),
    }));

    for (const item of normalizedItems) {
      if (!item.productId || !item.name) {
        return res.status(400).json({ msg: "Each item must include id and name" });
      }

      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          msg: `Invalid product id for ${item.name}. Please refresh products and try again.`,
        });
      }

      if (Number.isNaN(item.price) || item.price < 0) {
        return res.status(400).json({ msg: "Each item price must be a valid non-negative number" });
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ msg: "Each item quantity must be a positive integer" });
      }
    }

    const bodyTotal = isValidNumber(total);
    if (Number.isNaN(bodyTotal) || bodyTotal < 0) {
      return res.status(400).json({ msg: "Total must be a valid non-negative number" });
    }

    const computedTotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(computedTotal - bodyTotal) > 0.01) {
      return res.status(400).json({ msg: "Provided total does not match item totals" });
    }

    // Reserve stock atomically for each item
    for (const item of normalizedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Rollback already decremented products
        for (const prev of decrementedProducts) {
          await Product.findByIdAndUpdate(prev.productId, {
            $inc: { quantity: prev.quantity },
          });
        }

        return res.status(400).json({
          msg: `Insufficient stock for "${item.name}". Only remaining items are available.`,
        });
      }

      decrementedProducts.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    const shippingDetail = await ShippingDetail.create({
      userId,
      name: String(customer.name).trim(),
      phone: String(customer.phone).trim(),
      address: String(customer.address).trim(),
      city: String(customer.city).trim(),
    });

    const selectedPaymentMethod = String(paymentMethod || "Mock Card").trim();
    const initialStatus = selectedPaymentMethod === "COD" ? "confirmed" : "pending";

    const order = await Order.create({
      userId,
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        city: String(customer.city).trim(),
      },
      shippingDetailId: shippingDetail._id,
      items: normalizedItems,
      total: bodyTotal,
      paymentMethod: selectedPaymentMethod,
      status: initialStatus,
    });

    return res.status(201).json({
      msg: "Order placed successfully",
      order,
      shippingDetail,
    });
  } catch (error) {
    if (decrementedProducts.length > 0) {
      for (const prev of decrementedProducts) {
        await Product.findByIdAndUpdate(prev.productId, {
          $inc: { quantity: prev.quantity },
        });
      }
    }

    console.error("Error creating order:", error);
    return res.status(500).json({ msg: "Server error while creating order" });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.status === "confirmed") {
      return res.status(200).json({ msg: "Order is already confirmed", order });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ msg: `Order cannot be paid. Current status: ${order.status}` });
    }

    // Simulate payment processing delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Confirm mock payment successfully
    order.status = "confirmed";
    await order.save();

    return res.status(200).json({ msg: "Payment successful! Your order has been placed.", order });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ msg: "Server error while processing payment" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const shippingDetails = await ShippingDetail.find({ userId });
    const shippingIds = shippingDetails.map((sd) => sd._id);

    const orders = await Order.find({
      $or: [
        { userId },
        { shippingDetailId: { $in: shippingIds } },
      ],
    })
      .populate("shippingDetailId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ msg: "Orders retrieved", orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ msg: "Server error while fetching orders" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ msg: "Order is already cancelled" });
    }

    if (order.status === "delivered") {
      return res.status(400).json({ msg: "Cannot cancel a delivered order" });
    }

    order.status = "cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity },
      });
    }

    return res.status(200).json({ msg: "Order cancelled successfully. Stock has been restored.", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ msg: "Server error while cancelling order" });
  }
};
