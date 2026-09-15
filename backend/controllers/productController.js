import Product from "../models/Product.js";

// Get all products with advanced filters
export const getAllProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, inStock, sort } = req.query;
        let query = {};

        // Multi-field search (name, description, category)
        if (search && search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ];
        }

        // Case-insensitive category match
        if (category && category !== "All" && category.trim()) {
            query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        // Price range filtering
        if ((minPrice !== undefined && minPrice !== "") || (maxPrice !== undefined && maxPrice !== "")) {
            query.price = {};
            if (minPrice !== undefined && minPrice !== "" && !isNaN(Number(minPrice))) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice))) {
                query.price.$lte = Number(maxPrice);
            }
            if (Object.keys(query.price).length === 0) {
                delete query.price;
            }
        }

        // In-stock filtering
        if (inStock === "true" || inStock === true) {
            query.quantity = { $gt: 0 };
        }

        // Sorting
        let sortOption = { _id: -1 };
        if (sort === "price-asc") sortOption = { price: 1 };
        else if (sort === "price-desc") sortOption = { price: -1 };
        else if (sort === "name-asc") sortOption = { name: 1 };
        else if (sort === "name-desc") sortOption = { name: -1 };

        const [products, distinctCategories] = await Promise.all([
            Product.find(query).sort(sortOption),
            Product.distinct("category")
        ]);
        
        res.status(200).json({
            msg: "Products retrieved successfully",
            products: products || [],
            categories: distinctCategories || []
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
        const { name, price, quantity, image, description, category } = req.body;
        
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
            category: category || "General",
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
        const { name, price, quantity, image, description, category } = req.body;

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

        if (typeof category !== "undefined") {
            updateData.category = category;
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
