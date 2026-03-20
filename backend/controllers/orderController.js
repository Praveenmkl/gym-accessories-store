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

    for (const item of normalizedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        for (const prev of decrementedProducts) {
          await Product.findByIdAndUpdate(prev.productId, {
            $inc: { quantity: prev.quantity },
          });
        }

        return res.status(400).json({
          msg: `Insufficient stock for ${item.name}`,
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

    const order = await Order.create({
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        city: String(customer.city).trim(),
      },
      shippingDetailId: shippingDetail._id,
      items: normalizedItems,
      total: bodyTotal,
      paymentMethod: String(paymentMethod || "COD").trim() || "COD",
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
