import React from 'react';

const CartItem = ({ item, handleStepDown, handleStepUp, handleRemoveItem, calculateTotalPrice }) => (
  <div className="card rounded-3 mb-4" key={item.title}>
    <div className="card-body p-4">
      <div className="row d-flex justify-content-between align-items-center">
        <div className="col-md-2 col-lg-2 col-xl-2">
          <img src={item.poster_path} className="img-fluid rounded-3 food-image" alt={item.title} />
        </div>
        <div className="col-md-3 col-lg-3 col-xl-3">
          <p className="lead fw-normal mb-2">{item.title}</p>
          <p className="text-muted">Added to cart</p>
        </div>
        <div className="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center">
          <button className="btn btn-link px-2" onClick={() => handleStepDown(item)}>
            <i className="bi bi-dash icon-visible"></i>
          </button>
          <input min="1" value={item.quantity} type="number" className="form-control form-control-sm" readOnly />
          <button className="btn btn-link px-2" onClick={() => handleStepUp(item)}>
            <i className="bi bi-plus icon-visible"></i>
          </button>
        </div>
        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
          <h5 className="mb-0">{calculateTotalPrice(item)} LE</h5>
        </div>
        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
          <a className="text-danger" onClick={() => handleRemoveItem(item)}>
            <i className="bi bi-trash3 icon-visible"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default CartItem;