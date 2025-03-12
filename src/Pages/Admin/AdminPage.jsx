import React, { useState } from "react";

const ordersData = [
  { id: 1, customer: "7amo al te5a", items: "Pizza, Coke", total: "$15", status: "pending" },
  { id: 2, customer: "essam sassa", items: "Burger, Fries", total: "$12", status: "pending" },
  { id: 3, customer: "7amo beka", items: "Pasta, Juice", total: "$18", status: "accepted" },
];

const OrderCard = ({ order, updateStatus }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Order #{order.id} - {order.customer}</h5>
        <p className="card-text">
          <strong>Items:</strong> {order.items} <br />
          <strong>Total:</strong> {order.total}
        </p>
        <span className={`badge ${order.status === "pending" ? "bg-warning" : order.status === "accepted" ? "bg-success" : "bg-danger"}`}>
          {order.status.toUpperCase()}
        </span>
        {order.status === "pending" && (
          <div className="mt-2">
            <button className="btn btn-success me-2" onClick={() => updateStatus(order.id, "accepted")}>
              ✅ Accept
            </button>
            <button className="btn btn-danger" onClick={() => updateStatus(order.id, "rejected")}>
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState(ordersData);

  const updateStatus = (id, status) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
  };

  return (
    <div className="container mt-4">
      <h2>Orders Management</h2>
      <div className="row">
        {orders.map(order => (
          <div className="col-md-6" key={order.id}>
            <OrderCard order={order} updateStatus={updateStatus} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

