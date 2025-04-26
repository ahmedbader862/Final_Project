import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../Context/ThemeContext';

const CartItem = ({ item, handleStepDown, handleStepUp, handleRemoveItem, calculateTotalPrice }) => {
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-light text-dark';
  const inputBg = theme === 'dark' ? 'bg-secondary text-white border-0' : '';

  return (
    <div className={`card rounded-3 border-0 mb-4 ${cardClass}`} key={item.title}>
      <div className="card-body p-3">
        <div className="row d-flex align-items-center">
          <div className="col-4 col-md-2">
            <img
              src={item.poster_path}
              className="img-fluid rounded-3 w-100"
              alt={item.title + (text?.addedToCart || " added to cart")}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="col-8 col-md-3">
            <p className="fw-bold mb-1">{item.title}</p>
            <p className="text-muted small mb-0">{text?.addedToCart || "Added to cart"}</p>
          </div>

          <div className="col-12 col-md-3 d-flex align-items-center mt-2 mt-md-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleStepDown(item)}>
              <i className="bi bi-dash"></i>
            </button>
            <input
              min="1"
              value={item.quantity}
              type="number"
              className={`form-control form-control-sm mx-2 text-center ${inputBg}`}
              readOnly
              style={{ width: '60px' }}
            />
            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleStepUp(item)}>
              <i className="bi bi-plus"></i>
            </button>
          </div>

          <div className="col-6 col-md-2 mt-2 mt-md-0">
            <h6 className="mb-0">{calculateTotalPrice(item)} {text?.currency || "LE"}</h6>
          </div>

          <div className="col-6 col-md-2 text-end mt-2 mt-md-0">
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem(item)}>
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;