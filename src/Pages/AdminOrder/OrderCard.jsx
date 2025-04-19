import React from 'react';
import { CheckCircle, XCircle, Trash } from 'react-bootstrap-icons';

const OrderCard = ({ order, updateStatus, updateTrackingStatus, deleteOrder }) => {
  const paymentStatus = order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Paid (PayPal)";
  const trackingStatuses = [
    "Order Placed",
    "Processing",
    "Out for Delivery",
    "Delivered"
  ];

  return (
    <div className="order-card mb-4">
      <div className="order-header">
        <h5>Order #{order.id}</h5>
        <p className="order-customer">{order.customer}</p>
        <span
          className={`status-badge ${
            order.status === "pending"
              ? "status-pending"
              : order.status === "accepted"
              ? "status-accepted"
              : "status-rejected"
          }`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="order-body">
        <div className="order-section">
          <span className="section-label">Items:</span>
          <span>
            {Array.isArray(order.items)
              ? order.items.map((item, index) => (
                  <span key={index}>
                    {item.title} (x{item.quantity})
                    {index < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))
              : order.items || 'No items'}
          </span>
        </div>
        <div className="order-section">
          <span className="section-label">Total:</span>
          <span className="order-total">{parseFloat(order.total || 0).toFixed(2)} LE</span>
        </div>
        <div className="order-section">
          <span className="section-label">Placed:</span>
          <span>
            {order.timestamp
              ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </span>
        </div>
        {order.shipping && (
          <div className="order-section">
            <span className="section-label">Shipping Details:</span>
            <div className="shipping-details">
              <p>City: {order.shipping.city}</p>
              <p>Phone: {order.shipping.phone}</p>
              <p>Details: {order.shipping.details}</p>
            </div>
          </div>
        )}
        <div className="order-section">
          <span className="section-label">Discount Applied:</span>
          <span>{order.discountApplied ? "Yes (20%)" : "No"}</span>
        </div>
        <div className="order-section">
          <span className="section-label">Payment:</span>
          <span className={`payment-badge ${order.paymentMethod === "cash_on_delivery" ? "payment-cod" : "payment-paid"}`}>
            {paymentStatus}
          </span>
        </div>
        <div className="order-section">
          <span className="section-label">Tracking Status:</span>
          <select
            className="tracking-select"
            value={order.trackingStatus || "Order Placed"}
            onChange={(e) => updateTrackingStatus(order.id, e.target.value)}
          >
            {trackingStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="order-footer">
        {order.status === "pending" && (
          <>
            <button
              className="btn btn-accept"
              onClick={() => updateStatus(order.id, "accepted")}
            >
              <CheckCircle size={16} className="me-1" /> Accept
            </button>
            <button
              className="btn btn-reject"
              onClick={() => updateStatus(order.id, "rejected")}
            >
              <XCircle size={16} className="me-1" /> Reject
            </button>
          </>
        )}
        <button
          className="btn btn-delete"
          onClick={() => deleteOrder(order.id)}
        >
          <Trash size={16} className="me-1" /> Delete
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
