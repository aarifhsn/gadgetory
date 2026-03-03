import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF(order, options = { download: true }) {
  if (!order) return;

  const doc = new jsPDF("p", "mm", "a4");
  const orderDate =
    order.date ||
    new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const marginX = 14;
  const rightColumnX = 120;
  let y = 20;

  // HEADER
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GADGETS BD", marginX, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Order Invoice", marginX, y + 6);

  doc.text(`Order #: ${order.orderNumber}`, 150, y);
  doc.text(`Date: ${orderDate}`, 150, y + 6);

  y += 18;

  // SHIPPING + SHOP INFO (two columns)
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Address", marginX, y);
  doc.text("Sold By", rightColumnX, y);

  doc.setFont("helvetica", "normal");

  doc.setFont("helvetica", "normal");
  doc.text(order.shippingAddress?.name || "N/A", marginX, y + 6);
  doc.text(order.shippingAddress?.address || "N/A", marginX, y + 11);
  doc.text(
    `${order.shippingAddress?.city || ""} ${order.shippingAddress?.postalCode || ""}`,
    marginX,
    y + 16,
  );
  doc.text(order.shippingAddress?.country || "", marginX, y + 21);
  doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, marginX, y + 26);
  doc.text(`Email: ${order.shippingAddress?.email || "N/A"}`, marginX, y + 31);

  // RIGHT: Shop Info
  doc.text(order.shopInfo?.shopName || "Official Store", rightColumnX, y + 6);
  doc.text(
    order.shopInfo?.address || "Dhaka, Bangladesh",
    rightColumnX,
    y + 11,
  );
  doc.text(order.shopInfo?.city || "Dhaka", rightColumnX, y + 16);

  if (order.shopInfo?.website) {
    doc.text(order.shopInfo?.website, rightColumnX, y + 21);
  }

  doc.text(
    `Email: ${order.shopInfo?.email || "support@gadgetsbd.com"}`,
    rightColumnX,
    y + 26,
  );

  y += 36;

  // ITEMS TABLE
  autoTable(doc, {
    startY: y,
    head: [["Product", "Qty", "Unit Price", "Subtotal"]],
    body: order.items.map((item) => [
      item.name,
      item.quantity,
      `BDT ${item.price.toLocaleString()}`,
      `BDT ${(item.price * item.quantity).toLocaleString()}`,
    ]),
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: "bold" },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // SUMMARY
  const summaryX = 120;
  doc.text("Subtotal:", summaryX, y);
  doc.text(`BDT ${order.subtotal.toLocaleString()}`, 190, y, {
    align: "right",
  });
  y += 6;
  doc.text("Delivery Fee:", summaryX, y);
  doc.text(
    order.deliveryFee === 0
      ? "FREE"
      : `BDT ${order.deliveryFee.toLocaleString()}`,
    190,
    y,
    { align: "right" },
  );
  y += 6;
  doc.text("Service Fee:", summaryX, y);
  doc.text(`BDT ${order.serviceFee.toLocaleString()}`, 190, y, {
    align: "right",
  });
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", summaryX, y);
  doc.text(`BDT ${order.total.toLocaleString()}`, 190, y, { align: "right" });

  // FOOTER
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for shopping with Gadgets BD!", marginX, 285);

  // 🔹 Client-side download
  if (options.download) {
    doc.save(`invoice-${order.orderNumber}.pdf`);
    return;
  }

  // ✅ Return as ArrayBuffer for Node.js
  return doc.output("arraybuffer");
}
