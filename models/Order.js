import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        sellerId: mongoose.Schema.Types.ObjectId,
        slug: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
      email: String,
    },
    shopInfo: {
      sellerId: mongoose.Schema.Types.ObjectId,
      shopName: String,
      email: String,
      address: String,
      city: String,
      website: String,
    },
    subtotal: Number,
    deliveryFee: Number,
    serviceFee: Number,
    total: Number,
    paymentMethod: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
