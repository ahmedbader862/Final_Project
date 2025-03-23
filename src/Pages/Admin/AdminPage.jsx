// src/Pages/Admin/AdminOrdersPage.js
import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from '../../firebase/firebase';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const OrderCard = ({ order, updateStatus, deleteOrder }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Order #{order.id} - {order.customer}</h5>
        <p className="card-text">
          <strong>Items:</strong> {order.items} <br />
          <strong>Total:</strong> {order.total} <br />
          <strong>Placed:</strong> {new Date(order.timestamp).toLocaleString()} <br />
          {order.shipping && (
            <>
              <strong>Shipping Details:</strong> <br />
              <span className="ms-2">
                <strong>City:</strong> {order.shipping.city} <br />
                <strong>Phone:</strong> {order.shipping.phone} <br />
                <strong>Details:</strong> {order.shipping.details} <br />
              </span>
            </>
          )}
          <strong>Discount Applied:</strong> {order.discountApplied ? "Yes (20%)" : "No"}
        </p>
        <span
          className={`badge ${
            order.status === "pending"
              ? "bg-warning text-dark"
              : order.status === "accepted"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {order.status.toUpperCase()}
        </span>
        <div className="mt-2 d-flex gap-2">
          {order.status === "pending" && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => updateStatus(order.id, "accepted")}
              >
                ✅ Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateStatus(order.id, "rejected")}
              >
                ❌ Reject
              </button>
            </>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteOrder(order.id)}
          >
            <i className="bi bi-trash3"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [refundMessage, setRefundMessage] = useState(null);

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const amount = parseFloat(order.total.replace(" LE", ""));
    return sum + amount;
  }, 0).toFixed(2);
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const statusBreakdown = {
    pending: orders.filter(order => order.status === "pending").length,
    accepted: orders.filter(order => order.status === "accepted").length,
    rejected: orders.filter(order => order.status === "rejected").length,
  };

  // Prepare data for charts
  // Line chart: Orders over time
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const lineChartData = {
    labels: Object.keys(ordersByDate),
    datasets: [
      {
        label: "Orders Over Time",
        data: Object.values(ordersByDate),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Pie chart: Order status distribution
  const pieChartData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Order Status",
        data: [statusBreakdown.pending, statusBreakdown.accepted, statusBreakdown.rejected],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)", // Yellow for pending
          "rgba(54, 162, 235, 0.6)", // Blue for accepted
          "rgba(255, 99, 132, 0.6)", // Red for rejected
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);

      if (newStatus === "rejected") {
        setRefundMessage(`Order #${orderId}: Your money is refunding as soon as possible.`);
        setTimeout(() => setRefundMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete Order #${orderId}?`)) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await deleteDoc(orderRef);
        console.log(`Order ${orderId} deleted`);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const clearAllOrders = async () => {
    if (window.confirm("Are you sure you want to delete all orders? This action cannot be undone.")) {
      try {
        const ordersCollection = collection(db, "orders");
        const snapshot = await getDocs(ordersCollection);
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log("All orders deleted");
      } catch (error) {
        console.error("Error clearing all orders:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Orders Management</h2>
        {orders.length > 0 && (
          <button
            className="btn btn-danger btn-sm"
            onClick={clearAllOrders}
          >
            Clear All Orders
          </button>
        )}
      </div>

      {refundMessage && (
        <div className="alert alert-info" role="alert">
          {refundMessage}
        </div>
      )}

      {/* Statistics Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text display-6">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="card-text display-6">{totalRevenue} LE</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Average Order Value</h5>
              <p className="card-text display-6">{averageOrderValue} LE</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Pending Orders</h5>
              <p className="card-text display-6">{statusBreakdown.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {orders.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Orders Over Time</h5>
                <Line data={lineChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Order Status Distribution</h5>
                <Pie data={pieChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6" key={order.id}>
              <OrderCard
                order={order}
                updateStatus={updateStatus}
                deleteOrder={deleteOrder}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
