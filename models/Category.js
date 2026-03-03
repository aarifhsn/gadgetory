// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Display name
  slug: { type: String, required: true, unique: true }, // "laptops"

  image: String, // fallback image

  homepage: {
    showTop: Boolean,
    showBottom: Boolean,
    orderTop: Number,
    orderBottom: Number,
    layout: { type: String, enum: ["single", "grid"] },
  },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
