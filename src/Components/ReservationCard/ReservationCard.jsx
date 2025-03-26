import React from "react";

const ReservationCard = ({ reservation }) => {
  if (!reservation) return null;

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Reservation Details</h5>
        <p className="card-text">
          <strong>Table Number:</strong> {reservation.tableNumber}
        </p>
        <p className="card-text">
          <strong>Name:</strong> {reservation.name}
        </p>
        <p className="card-text">
          <strong>Date:</strong> {reservation.date}
        </p>
        <p className="card-text">
          <strong>Time:</strong> {reservation.time}
        </p>
      </div>
    </div>
  );
};

export default ReservationCard;