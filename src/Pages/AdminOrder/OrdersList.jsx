import React from 'react';
import OrderCard from './OrderCard';

const OrdersList = ({ orders, updateStatus, updateTrackingStatus, deleteOrder }) => (
  <div className="row">
    {orders.map(order => (
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
);

export default OrdersList;