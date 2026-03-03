import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { generateInvoicePDF } from "@/utils/invoicePdf";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  const mongoSession = await mongoose.startSession();

  try {
    const authSession = await auth();
    const orderData = await request.json();

    // Validate required fields for guest checkout
    if (!orderData.shippingAddress?.phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    mongoSession.startTransaction();

    // Get seller info
    const firstProduct = await Product.findById(orderData.items[0].productId)
      .session(mongoSession)
      .lean();

    // const seller = await User.findById(firstProduct?.sellerId).lean();
    const seller = firstProduct
      ? await User.findById(firstProduct.sellerId).session(mongoSession).lean()
      : null;

    const shopInfo = seller
      ? {
          sellerId: seller._id,
          shopName: seller.shopName || seller.name,
          email: seller.email,
          address: seller.shopProfile?.address,
          city: seller.shopProfile?.city,
          website: seller.shopProfile?.website,
        }
      : null;

    // STOCK UPDATE
    for (const item of orderData.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stockQuantity: { $gte: item.quantity }, // validate stock
        },
        {
          $inc: {
            stockQuantity: -item.quantity, // decrease stock
            unitsSold: item.quantity, // increase sold
          },
        },
        { new: true, session: mongoSession },
      );

      if (!updatedProduct) {
        throw new Error("Insufficient stock for one or more items");
      }
    }

    // 2. Create order record
    const [order] = await Order.create(
      [
        {
          userId: authSession?.user?.id || null,
          customerType: authSession?.user ? "registered" : "guest",
          orderNumber: orderData.orderNumber,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          shopInfo,
          subtotal: orderData.subtotal,
          deliveryFee: orderData.deliveryFee,
          serviceFee: orderData.serviceFee,
          total: orderData.total,
          paymentMethod: orderData.paymentMethod,
          status: "pending",
          createdAt: new Date(),
        },
      ],
      { session: mongoSession },
    );

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    const orderObject = {
      ...order.toObject(),
      shopInfo,
    };

    // SEND EMAIL (logged-in users only)
    if (authSession?.user?.email) {
      const pdfArrayBuffer = generateInvoicePDF(order.toObject(), {
        download: false,
      });

      await sendInvoiceEmail({
        to: authSession.user.email,
        subject: `Invoice for Order #${order.orderNumber}`,
        html: `<h1>Invoice for Order #${order.orderNumber}</h1>`,
        attachments: [
          {
            filename: `invoice-${order.orderNumber}.pdf`,
            content: Buffer.from(pdfArrayBuffer),
            contentType: "application/pdf",
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();

    console.error("Create order error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
