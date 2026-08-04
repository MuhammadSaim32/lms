import OrderAnalytics from "../admin/order-analytics/page"
import UserAnalytics from "../admin/user-analytics/page"
export default function Dashboard() {
  return <div className="h-full w-full flex">
      <OrderAnalytics />
      <UserAnalytics />
  </div>
}