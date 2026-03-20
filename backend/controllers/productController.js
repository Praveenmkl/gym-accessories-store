import Product from "../models/Product.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        if (products.length === 0) {
            return res.status(200).json({
                msg: "No products found",
                products: []
            });
        }
        
        res.status(200).json({
            msg: "Products retrieved successfully",
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ msg: "Server error while fetching products" });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        
        res.status(200).json({
            msg: "Product retrieved successfully",
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ msg: "Server error while fetching product" });
    }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
    try {
        const { name, price, quantity, image, description } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ msg: "Name and price are required" });
        }

        const parsedPrice = Number(price);
        const parsedQuantity = Number(quantity ?? 0);

        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ msg: "Price must be a valid non-negative number" });
        }

        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({ msg: "Quantity must be a valid non-negative integer" });
        }
        
        const product = await Product.create({
            name,
            price: parsedPrice,
            quantity: parsedQuantity,
            image,
            description
        });
        
        res.status(201).json({
            msg: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ msg: "Server error while creating product" });
    }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, image, description } = req.body;

        const updateData = {};

        if (typeof name !== "undefined") {
            if (!String(name).trim()) {
                return res.status(400).json({ msg: "Name cannot be empty" });
            }
            updateData.name = name;
        }

        if (typeof price !== "undefined") {
            const parsedPrice = Number(price);
            if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ msg: "Price must be a valid non-negative number" });
            }
            updateData.price = parsedPrice;
        }

        if (typeof quantity !== "undefined") {
            const parsedQuantity = Number(quantity);
            if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
                return res.status(400).json({ msg: "Quantity must be a valid non-negative integer" });
            }
            updateData.quantity = parsedQuantity;
        }

        if (typeof image !== "undefined") {
            updateData.image = image;
        }

        if (typeof description !== "undefined") {
            updateData.description = description;
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.status(200).json({
            msg: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ msg: "Server error while updating product" });
    }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        
        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ msg: "Server error while deleting product" });
    }
};
