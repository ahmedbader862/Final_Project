import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, arrayUnion, getDoc } from '../../firebase/firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Swal from 'sweetalert2';
import StatsSection from './StatsSection';
import ChartsSection from './ChartsSection';
import OrdersList from './OrdersList';
import RefundMessage from './RefundMessage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [refundMessage, setRefundMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => console.error("Error fetching orders:", error)
    );
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderData = (await getDoc(orderRef)).data();
      await updateDoc(orderRef, { status: newStatus });

      if (newStatus === "accepted" && orderData.userId) {
        await updateDoc(doc(db, "users2", orderData.userId), {
          acceptedOrders: arrayUnion({
            orderId,
            ...orderData,
            trackingStatus: orderData.trackingStatus || "Order Placed",
          }),
        });
        Swal.fire("Success!", `Order ${orderId} accepted`, "success");
      } else if (newStatus === "rejected") {
        setRefundMessage(`Order #${orderId}: Refunding soon (if PayPal).`);
        setTimeout(() => setRefundMessage(null), 5000);
      }
    } catch (error) {
      Swal.fire("Error!", `Failed to update order: ${error.message}`, "error");
    }
  };

  const updateTrackingStatus = (orderId, newTrackingStatus) =>
    updateDoc(doc(db, "orders", orderId), { trackingStatus: newTrackingStatus });

  const deleteOrder = (orderId) =>
    Swal.fire({
      title: "Are you sure?",
      text: `Delete Order #${orderId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "orders", orderId));
        Swal.fire("Deleted!", `Order #${orderId} deleted`, "success");
      }
    });

  const clearAllOrders = () =>
    Swal.fire({
      title: "Delete all orders?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const snapshot = await getDocs(collection(db, "orders"));
        await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
        Swal.fire("Deleted!", "All orders cleared", "success");
      }
    });

  const getChartData = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
      .toFixed(2);
    const statusBreakdown = {
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    };
    const paymentBreakdown = {
      cod: orders.filter((o) => o.paymentMethod === "cash_on_delivery").length,
      paid: orders.filter((o) => o.paymentMethod === "paypal").length,
    };
    const ordersByDate = orders.reduce((acc, o) => {
      const date = o.timestamp
        ? new Date(o.timestamp.seconds ? o.timestamp.toDate() : o.timestamp).toLocaleDateString()
        : "Unknown";
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      pendingOrders: statusBreakdown.pending,
      lineChartData: {
        labels: Object.keys(ordersByDate),
        datasets: [
          { label: "Orders Over Time", data: Object.values(ordersByDate), borderColor: "#4A919E", tension: 0.1 },
        ],
      },
      statusPieChartData: {
        labels: ["Pending", "Accepted", "Rejected"],
        datasets: [
          {
            data: [statusBreakdown.pending, statusBreakdown.accepted, statusBreakdown.rejected],
            backgroundColor: ["#D4A017", "#4A919E", "#B73E3E"],
            borderColor: ["#E0B02A", "#5AA5B2", "#C94E4E"],
            borderWidth: 1,
          },
        ],
      },
      paymentPieChartData: {
        labels: ["Cash on Delivery", "Paid (PayPal)"],
        datasets: [
          {
            data: [paymentBreakdown.cod, paymentBreakdown.paid],
            backgroundColor: ["#4A919E", "#3A6D8C"],
            borderColor: ["#5AA5B2", "#4A7D9C"],
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const { totalOrders, totalRevenue, avgOrderValue, pendingOrders, lineChartData, statusPieChartData, paymentPieChartData } = getChartData();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-white">Orders Management</h2>
        {orders.length > 0 && (
          <Button className="btn btn-danger btn-sm" onClick={clearAllOrders}>
            Clear All Orders
          </Button>
        )}
      </div>
      <RefundMessage message={refundMessage} />
      <StatsSection totalOrders={totalOrders} totalRevenue={totalRevenue} avgOrderValue={avgOrderValue} pendingOrders={pendingOrders} />
      {orders.length > 0 && (
        <>
          <ChartsSection lineChartData={lineChartData} statusPieChartData={statusPieChartData} paymentPieChartData={paymentPieChartData} />
          <OrdersList orders={orders} updateStatus={updateStatus} updateTrackingStatus={updateTrackingStatus} deleteOrder={deleteOrder} />
        </>
      )}
      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
};

export default AdminOrdersPage;