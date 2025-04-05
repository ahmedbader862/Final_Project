import React from 'react'

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

  export default OrderCard;
