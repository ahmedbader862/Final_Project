import React from 'react';
import "./CouponSection.css"; // Assuming you have a CSS file for styles
const CouponSection = ({ couponCode, setCouponCode, handleApplyCoupon, cartItems, theme }) => {
  const cardBg = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light';
  const inputClass = theme === 'dark' ? 'bg-secondary text-white' : 'bg-light text-dark';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';
  const btnClass = theme === 'dark' ? 'btn-light' : 'btn-dark';

  return (
    <div className={`coupon border-0 mb-4 ${cardBg}`}>
      <div className="card-body p-4 d-flex flex-row">
      <label className={`form-label copon-lable badge bdg px-2 mt-1 ${labelClass}`} htmlFor="discountCode">
            Coupon Code
          </label>
        <div className="form-outline flex-fill">
          <input
            type="text"
            id="discountCode"
            className={`form-control rounded-3 form-control-lg ${inputClass}`}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={cartItems.length === 0}
          />
          
        </div>
        <button
          type="button"
          className={`btn btn-lg ms-3 ${btnClass}`}
          onClick={handleApplyCoupon}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CouponSection;
