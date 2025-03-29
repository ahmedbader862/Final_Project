import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, getDoc, arrayUnion } from '../../firebase/firebase';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Swal from 'sweetalert2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const OrderCard = ({ order, updateStatus, updateTrackingStatus, deleteOrder }) => {
  const paymentStatus = order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Paid (PayPal)";
  const paymentBadgeClass = order.paymentMethod === "cash_on_delivery" ? "bg-info" : "bg-success";
  const trackingStatuses = [
    "Order Placed",
    "Processing",
    "Out for Delivery",
    "Delivered"
  ];

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
          <strong>Discount Applied:</strong> {order.discountApplied ? "Yes (20%)" : "No"} <br />
          <strong>Payment:</strong> <span className={`badge ${paymentBadgeClass} ms-2`}>{paymentStatus}</span> <br />
          <strong>Tracking Status:</strong>
          <select
            className="form-select d-inline-block w-auto ms-2"
            value={order.trackingStatus || "Order Placed"}
            onChange={(e) => updateTrackingStatus(order.id, e.target.value)}
          >
            {trackingStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </p>
        <span
          className={`badge ${order.status === "pending"
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      console.log(`Starting updateStatus for order ${orderId} with status ${newStatus}`);

      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      if (!orderSnapshot.exists()) {
        console.error("Order not found in Firestore:", orderId);
        Swal.fire('Error!', 'Order not found in Firestore.', 'error');
        return;
      }
      const orderData = orderSnapshot.data();
      console.log("Order data:", orderData);

      await updateDoc(orderRef, { status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);

      if (newStatus === "accepted") {
        const userId = orderData.userId; // Use the userId field from the order
        console.log("User ID from order:", userId);

        if (!userId) {
          console.error("User ID not found in order data for order:", orderId);
          Swal.fire('Error!', 'User ID not found in order data.', 'error');
          return;
        }

        const userRef = doc(db, "users2", userId); // Reference the user document directly
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          console.error("User not found in users2 collection:", userId);
          Swal.fire('Error!', `User not found for ID: ${userId}`, 'error');
          return;
        }

        const orderToStore = {
          orderId: orderId,
          items: orderData.items,
          total: orderData.total,
          timestamp: orderData.timestamp,
          trackingStatus: orderData.trackingStatus || "Order Placed",
          paymentMethod: orderData.paymentMethod,
          customer: orderData.customer,
        };
        console.log("Order to store in acceptedOrders:", orderToStore);

        await updateDoc(userRef, {
          acceptedOrders: arrayUnion(orderToStore),
        });
        console.log(`Order ${orderId} successfully added to acceptedOrders for user ${userId}`);
        Swal.fire('Success!', `Order ${orderId} added to accepted orders for user ${userId}`, 'success');
      }

      if (newStatus === "rejected") {
        setRefundMessage(`Order #${orderId}: Your money is refunding as soon as possible (if paid via PayPal).`);
        setTimeout(() => setRefundMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error in updateStatus:", error);
      Swal.fire('Error!', `Failed to update order status: ${error.message}`, 'error');
    }
  };

  const updateTrackingStatus = async (orderId, newTrackingStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { trackingStatus: newTrackingStatus });
      console.log(`Order ${orderId} tracking status updated to ${newTrackingStatus}`);
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Order #${orderId}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await deleteDoc(orderRef);
          Swal.fire(
            'Deleted!',
            `Order #${orderId} has been deleted.`,
            'success'
          );
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting the order.',
            'error'
          );
        }
      }
    });
  };

  const clearAllOrders = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete ALL orders. This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const ordersCollection = collection(db, "orders");
          const snapshot = await getDocs(ordersCollection);
          const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
          Swal.fire(
            'Deleted!',
            'All orders have been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error clearing all orders:", error);
          Swal.fire(
            'Error!',
            'There was an error deleting all orders.',
            'error'
          );
        }
      }
    });
  };

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
  const paymentBreakdown = {
    cod: orders.filter(order => order.paymentMethod === "cash_on_delivery").length,
    paid: orders.filter(order => order.paymentMethod === "paypal").length,
  };

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

  const statusPieChartData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Order Status",
        data: [statusBreakdown.pending, statusBreakdown.accepted, statusBreakdown.rejected],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
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

  const paymentPieChartData = {
    labels: ["Cash on Delivery", "Paid (PayPal)"],
    datasets: [
      {
        label: "Payment Method",
        data: [paymentBreakdown.cod, paymentBreakdown.paid],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
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
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Order Status Distribution</h5>
                <Pie data={statusPieChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Payment Method Distribution</h5>
                <Pie data={paymentPieChartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6" key={order.id}>
              <OrderCard
                order={order}
                updateStatus={updateStatus}
                updateTrackingStatus={updateTrackingStatus}
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