import React from 'react'
import { useFormik } from 'formik';

export default function Shipping() {


    const handleSubmit = (values) => {
        console.log('Checkout Form Submitted:', values);

        // setShowCheckout(false); 
    };
    const formik = useFormik({
        initialValues: {
            city: '',
            phone: '',
            details: '',
        },
        onSubmit: handleSubmit,
    });

    return (
        <div className="container">
            <div className="mt-5 mb-5">
                <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="city" className="form-label">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                            className="form-control"
                            placeholder="Enter your city"
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="details" className="form-label">
                            Details
                        </label>
                        <input
                            type="text"
                            id="details"
                            name="details"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.details}
                            className="form-control"
                            placeholder="e.g., Apartment number, street"
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="phone" className="form-label">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            className="form-control"
                            placeholder="Enter your phone number"
                        />
                    </div>


                    {formik.errors.city && formik.touched.city ? (
                        <div className="alert alert-danger" role="alert">
                            {formik.errors.city}
                        </div>
                    ) : null}
                    {formik.errors.phone && formik.touched.phone ? (
                        <div className="alert alert-danger" role="alert">
                            {formik.errors.phone}
                        </div>
                    ) : null}
                    {formik.errors.details && formik.touched.details ? (
                        <div className="alert alert-danger" role="alert">
                            {formik.errors.details}
                        </div>
                    ) : null}


                    <button type="submit" className="btn clr text-white w-100">
                        Check Out
                    </button>
                </form>
            </div>
        </div>
    );
}
