import {
  getCustomerOrders,
  getShopOwnerOrders,
} from "@/app/actions/orderActions";
import { getSellerById } from "@/app/actions/sellerActions";
import { auth } from "@/auth";
import OrdersClient from "@/components/customer/OrdersClient";
import ShopOrdersClient from "@/components/seller/ShopOrdersClient";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isShopOwner = session.user.userType === "shopOwner";

  // Fetch orders based on user type
  let ordersData = [];

  if (isShopOwner) {
    const result = await getShopOwnerOrders(session.user.id);
    ordersData = result.success ? result.data : [];
  } else {
    const result = await getCustomerOrders(session.user.id);
    ordersData = result.success ? result.data : [];
  }

  let seller = null;
  if (ordersData.length > 0 && ordersData[0]?.shopInfo?.sellerId) {
    seller = await getSellerById(ordersData[0].shopInfo.sellerId);
  }

  // Provide a default seller object if none found
  if (!seller) {
    seller = { shopName: "Official Store" };
  }

  // Render different components based on user type
  return isShopOwner ? (
    <ShopOrdersClient orders={ordersData} />
  ) : (
    <OrdersClient orders={ordersData} seller={seller} />
  );
}
