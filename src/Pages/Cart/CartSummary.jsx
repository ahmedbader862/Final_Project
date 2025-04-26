import React from 'react';
import { useSelector } from 'react-redux';

const CartSummary = ({ calculateSubtotal, calculateTotal, discountApplied, theme }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const cardBg = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light';
  const discountColor = theme === 'dark' ? 'text-success' : 'text-success';

  return (
    <div className={`card border-0 mb-4 ${cardBg}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <p className="mb-0">{text?.subtotal || "Subtotal"}:</p>
          <p className="mb-0">{calculateSubtotal()} {text?.currency || "LE"}</p>
        </div>
        {discountApplied && (
          <div className={`d-flex justify-content-between mb-2 ${discountColor}`}>
            <p className="mb-0">{text?.discount20 || "Discount (20%)"}:</p>
            <p className="mb-0">-{(calculateSubtotal() * 0.2).toFixed(2)} {text?.currency || "LE"}</p>
          </div>
        )}
        <div className="d-flex justify-content-between">
          <h5 className="mb-0">{text?.total || "Total"}:</h5>
          <h5 className="mb-0">{calculateTotal()} {text?.currency || "LE"}</h5>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
