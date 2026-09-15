import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: {
        type: String,
        default: "General"
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    image: String,
    description: String,
})

export default mongoose.model("Product", productSchema)