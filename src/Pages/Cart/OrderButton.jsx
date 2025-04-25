import React from 'react';

const OrderButton = ({ handleOrderNow, theme }) => {
  const btnClass = theme === 'dark' ? 'btn-light' : 'btn-dark';

  return (
    <>
      
        <button 
          type="button" 
          className={`btn ${btnClass} btn-lg w-100`} 
          onClick={handleOrderNow}
        >
          Order Now
        </button>
      
    </>
  );
};

export default OrderButton;
