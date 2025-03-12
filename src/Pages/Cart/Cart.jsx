import React from 'react'
import './Cart.css'
import { Link } from 'react-router-dom';

export default function Cart() {
    const handleStepDown = (e) => {
        const input = e.currentTarget.parentNode.querySelector('input[type=number]');
        input.stepDown();
    };

    const handleStepUp = (e) => {
        const input = e.currentTarget.parentNode.querySelector('input[type=number]');
        input.stepUp();
    };

    return (
        <section className="h-100">
            <div className="container h-100 py-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-10">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-normal mb-0">Restaurant Cart</h3>
                            <div>
                                <p className="mb-0">
                                    <span className="text-muted">Sort by:</span>{' '}
                                    <a href="#!" className="text-body">
                                        price <i className="bi bi-chevron-down mt-1"></i>
                                    </a>
                                </p>
                            </div>
                        </div>


                        {[
                            {
                                id: 1,
                                name: 'Cheese Burger',
                                details: 'Extra Spicy, No Mayo',
                                price: '$12.99',
                                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
                            },
                            {
                                id: 2,
                                name: 'Margherita Pizza',
                                details: 'Thin Crust, Extra Cheese',
                                price: '$15.49',
                                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
                            },
                            {
                                id: 3,
                                name: 'Chicken Wings',
                                details: 'Buffalo Sauce, 6 pcs',
                                price: '$9.99',
                                image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
                            },
                            {
                                id: 4,
                                name: 'Caesar Salad',
                                details: 'Grilled Chicken, Croutons',
                                price: '$8.49',
                                image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
                            },
                        ].map((item) => (
                            <div className="card rounded-3 mb-4" key={item.id}>
                                <div className="card-body p-4">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                            <img
                                                src={item.image}
                                                className="img-fluid rounded-3 food-image"
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                            <p className="lead fw-normal mb-2">{item.name}</p>
                                            <p className="text-muted">{item.details}</p>
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center">
                                            <button className="btn btn-link px-2" onClick={handleStepDown}>
                                                <i className="bi bi-dash icon-visible"></i>
                                            </button>
                                            <input
                                                min="0"
                                                name="quantity"
                                                value="2"
                                                type="number"
                                                className="form-control form-control-sm"
                                                readOnly
                                            />
                                            <button className="btn btn-link px-2" onClick={handleStepUp}>
                                                <i className="bi bi-plus icon-visible"></i>
                                            </button>
                                        </div>
                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                            <h5 className="mb-0">{item.price}</h5>
                                        </div>
                                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                            <a href="#!" className="text-danger">
                                                <i className="bi bi-trash3 icon-visible"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}


                        <div className="card mb-4">
                            <div className="card-body p-4 d-flex flex-row">
                                <div className="form-outline flex-fill">
                                    <input type="text" id="discountCode" className="form-control form-control-lg" />
                                    <label className="form-label badge bdg px-2 text-white mt-1" htmlFor="discountCode">
                                        Coupon Code
                                    </label>
                                </div>
                                <button type="button" className="btn aclr btn-lg ms-3">
                                    Apply
                                </button>
                            </div>
                        </div>


                        <div className="card">
                            <div className="card-body">
                                <Link to={"/shippingadress"} type="button" className="btn clr  btn-lg w-100">
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
