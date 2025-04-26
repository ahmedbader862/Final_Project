import React from 'react';
import { CheckCircle, XCircle, Trash } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import './OrderCard.css'; // Assuming you have a CSS file for styling

const normalizeItems = (items) => {
  // Handle array case
  if (Array.isArray(items)) {
    return items
      .filter((item) => item && typeof item === 'object') // Ensure valid objects
      .map((item, index) => ({
        id: item.id || index,
        title: item.title || 'Unknown Item',
        quantity: Math.max(1, Math.floor(item.quantity || 1)), // Ensure quantity is at least 1 siedzib.com
      }));
  }

  // Optional: Handle string case (uncomment if legacy data exists)
  /*
  if (typeof items === 'string' && items.trim()) {
    return items.split(',').map((item, index) => ({
      id: index,
      title: item.trim() || 'Unknown Item',
      quantity: 1,
    }));
  }
  */

  // Log unexpected types for debugging
  if (items !== null && items !== undefined) {
    console.warn('Unexpected items type:', typeof items, items);
  }

  // Default to empty array for null, undefined, or other types
  return [];
};

const OrderCard = ({ order, updateStatus, updateTrackingStatus, deleteOrder }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const isArabic = currentLange.toLowerCase() === 'ar';

  const paymentStatus = order.paymentMethod === 'cash_on_delivery' ? text.cashOnDelivery : text.paidPaypal;
  const trackingStatuses = [text.orderPlaced, text.processing, text.outForDelivery, text.delivered];

  // Normalize items
  const items = normalizeItems(order.items);

  return (
    <div className="order-card mb-4">
      <div className="order-header">
        <h5>{text.order.replace('{orderId}', order.id)}</h5>
        <p className="order-customer">{order.customer}</p>
        <span
          className={`status-badge ${
            order.status === 'pending'
              ? 'status-pending'
              : order.status === 'accepted'
              ? 'status-accepted'
              : 'status-rejected'
          }`}
        >
          {text[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}
        </span>
      </div>

      <div className="order-body">
        <div className="order-section">
          <span className="section-label">{text.items}</span>
          <span>
            {items.length > 0
              ? items.map((item, index) => (
                  <span key={item.id}>
                    {item.title} (x{item.quantity})
                    {index < items.length - 1 ? ', ' : ''}
                  </span>
                ))
              : text.noItems}
          </span>
        </div>
        <div className="order-section">
          <span className="section-label">{text.total}</span>
          <span className="order-total">{parseFloat(order.total || 0).toFixed(2)} LE</span>
        </div>
        <div className="order-section">
          <span className="section-label">{text.placed}</span>
          <span>
            {order.timestamp
              ? new Date(order.timestamp.seconds ? order.timestamp.toDate() : order.timestamp).toLocaleString(
                  isArabic ? 'ar-EG' : 'en-US',
                  {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
              : 'N/A'}
          </span>
        </div>
        {order.shipping && (
          <div className="order-section">
            <span className="section-label">{text.shippingDetails}</span>
            <div className="shipping-details">
              <p>
                {text.city} {order.shipping.city}
              </p>
              <p>
                {text.phone} {order.shipping.phone}
              </p>
              <p>
                {text.details} {order.shipping.details}
              </p>
            </div>
          </div>
        )}
        <div className="order-section">
          <span className="section-label">{text.discountApplied}</span>
          <span>{order.discountApplied ? text.discountYes : text.discountNo}</span>
        </div>
        <div className="order-section">
          <span className="section-label">{text.payment}</span>
          <span
            className={`payment-badge ${order.paymentMethod === 'cash_on_delivery' ? 'payment-cod' : 'payment-paid'}`}
          >
                {paymentStatus}
          </span>
        </div>
        <div className="order-section">
          <span className="section-label">{text.trackingStatus}</span>
          <select
            className="tracking-select"
            value={order.trackingStatus || text.orderPlaced}
            onChange={(e) => updateTrackingStatus(order.id, e.target.value)}
          >
            {trackingStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="order-footer">
        {order.status === 'pending' && (
          <>
            <button className="btn btn-accept" onClick={() => updateStatus(order.id, 'accepted')}>
              <CheckCircle size={16} className="me-1" /> {text.accept}
            </button>
            <button className="btn btn-reject" onClick={() => updateStatus(order.id, 'rejected')}>
              <XCircle size={16} className="me-1" /> {text.reject}
            </button>
          </>
        )}
        <button className="btn btn-delete" onClick={() => deleteOrder(order.id)}>
          <Trash size={16} className="me-1" /> {text.delete}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;