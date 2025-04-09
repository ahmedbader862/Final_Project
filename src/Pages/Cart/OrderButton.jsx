import React from 'react';

const OrderButton = ({ handleOrderNow }) => (
  <div className="card">
    <div className="card-body">
      <button type="button" className="btn aclr btn-lg w-100" onClick={handleOrderNow}>
        Order Now
      </button>
    </div>
  </div>
);

export default OrderButton;