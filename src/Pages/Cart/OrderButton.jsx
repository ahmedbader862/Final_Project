import React from 'react';
import { useSelector } from 'react-redux';

const OrderButton = ({ handleOrderNow, theme }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const btnClass = theme === 'dark' ? 'btn-light' : 'btn-dark';

  return (
    <>
      <button 
        type="button" 
        className={`btn ${btnClass} btn-lg w-100`} 
        onClick={handleOrderNow}
      >
        {text?.orderNow || "Order Now"}
      </button>
    </>
  );
};

export default OrderButton;
