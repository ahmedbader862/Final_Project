import React from 'react';

const CouponSection = ({ couponCode, setCouponCode, handleApplyCoupon, cartItems }) => (
  <div className="card mb-4">
    <div className="card-body p-4 d-flex flex-row">
      <div className="form-outline flex-fill">
        <input 
          type="text" 
          id="discountCode" 
          className="form-control form-control-lg"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={cartItems.length === 0}
        />
        <label className="form-label badge bdg px-2 text-white mt-1" htmlFor="discountCode">
          Coupon Code
        </label>
      </div>
      <button type="button" className="btn aclr btn-lg ms-3" onClick={handleApplyCoupon}>
        Apply
      </button>
    </div>
  </div>
);

export default CouponSection;