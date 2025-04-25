import React from 'react';

const CartSummary = ({ calculateSubtotal, calculateTotal, discountApplied, theme }) => {
  const cardBg = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light';
  const discountColor = theme === 'dark' ? 'text-success' : 'text-success';

  return (
    <div className={`card border-0 mb-4 ${cardBg}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <p className="mb-0">Subtotal:</p>
          <p className="mb-0">{calculateSubtotal()} LE</p>
        </div>
        {discountApplied && (
          <div className={`d-flex justify-content-between mb-2 ${discountColor}`}>
            <p className="mb-0">Discount (20%):</p>
            <p className="mb-0">-{(calculateSubtotal() * 0.2).toFixed(2)} LE</p>
          </div>
        )}
        <div className="d-flex justify-content-between">
          <h5 className="mb-0">Total:</h5>
          <h5 className="mb-0">{calculateTotal()} LE</h5>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
