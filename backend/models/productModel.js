import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    image: { type: String, required: false },
    isHidden: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const variantSchema = mongoose.Schema({
  value: { type: String, required: true, trim: true },
  sku: { type: String, trim: true },
  price: { type: Number },
  priceUGX: { type: Number },
  priceRWF: { type: Number },
  countInStock: { type: Number, default: 0 },
});

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default: "https://img.icons8.com/external-bartama-glyph-64-bartama-graphic/1200/external-Cart-e-commerce-glyph-bartama-glyph-64-bartama-graphic.jpg"
    },
    images: [{ type: String }],
    video: { type: String },
    brand: { type: String, required: false },
    quantity: { type: Number, required: false, default: 0 },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    priceUGX: { type: Number, required: true, default: 0 },
    priceRWF: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: false, default: 0 },
    stockStatus: { type: String, enum: ['in_stock', 'requires_shipping', 'coming_soon'], default: 'in_stock' },
    availabilityStartDate: { type: Date },
    availabilityEndDate: { type: Date },
    discountQtyThreshold: { type: Number, default: 0 },
    discountType: { type: String, enum: ['per_item', 'overall'], default: 'per_item' },
    discountUSD: { type: Number, default: 0 },
    discountUGX: { type: Number, default: 0 },
    discountRWF: { type: Number, default: 0 },
    negotiable: { type: Boolean, default: false },
    availableIn: { type: String, enum: ['Uganda', 'Rwanda', 'Both'], default: 'Both' },
    isPinned: { type: Boolean, default: false },
    condition: { type: String, enum: ['Brand New', 'Used', 'Refurbished'], default: 'Brand New' },
    variantLabel: { type: String, trim: true },
    variants: [variantSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
