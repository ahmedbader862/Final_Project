import React from 'react';
import { useSelector } from 'react-redux';

const CouponSection = ({ couponCode, setCouponCode, handleApplyCoupon, cartItems, theme }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const cardBg = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light';
  const inputClass = theme === 'dark' ? 'bg-secondary text-white' : 'bg-light text-dark';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';
  const btnClass = theme === 'dark' ? 'btn-light' : 'btn-dark';

  return (
    <div className={`card border-0 mb-4 ${cardBg}`}>
      <div className="card-body p-4 d-flex flex-row">
        <div className="form-outline flex-fill">
          <input
            type="text"
            id="discountCode"
            className={`form-control rounded-3 form-control-lg ${inputClass}`}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={cartItems.length === 0}
          />
          <label className={`form-label badge bdg px-2 mt-1 ${labelClass}`} htmlFor="discountCode">
            {text?.couponCodeLabel || "Coupon Code"}
          </label>
        </div>
        <button
          type="button"
          className={`btn btn-lg ms-3 ${btnClass}`}
          onClick={handleApplyCoupon}
        >
          {text?.apply || "Apply"}
        </button>
      </div>
    </div>
  );
};

export default CouponSection;
