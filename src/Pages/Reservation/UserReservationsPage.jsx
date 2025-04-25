import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ThemeContext } from "../../Context/ThemeContext";
import { Card, Row, Col, Alert, Button } from "react-bootstrap";

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const navigate = useNavigate();

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const cardBg = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";
  const btnClass = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to view your reservations.");
      return;
    }

    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userReservations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(userReservations);
      },
      (error) => {
        setError("Failed to load reservations: " + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#D4A017";
      case "accepted":
        return "#4A919E";
      case "rejected":
        return "#B73E3E";
      default:
        return "#ffffff";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return text.pendingMessage || "Awaiting admin approval. You’ll be notified once confirmed.";
      case "accepted":
        return text.acceptedMessage || "Your reservation is confirmed! We look forward to seeing you.";
      case "rejected":
        return text.rejectedMessage || "Sorry, your reservation was not approved. Please try a different time or table.";
      default:
        return "";
    }
  };

  return (
    <div className={` ${bgColor} ${textColor} py-5 rounded`}>
      <div className="container">
        <h1 className="text-center mb-4">{text.myReservationsTitle || "My Reservations"}</h1>

        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        {reservations.length > 0 ? (
          <>
            <Row>
              {reservations.map((reservation) => (
                <Col md={6} lg={4} className="mb-4" key={reservation.id}>
                  <Card className={`${cardBg} border-0 shadow`}>
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-center">
                        <span>
                          Reservation #{reservation.reservationId || reservation.id || "Unknown"}
                        </span>
                        <span
                          style={{
                            color: getStatusColor(reservation.status),
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {reservation.status || "pending"}
                        </span>
                      </Card.Title>
                      <Card.Text>
                        <strong>Table ID:</strong> {reservation.tableId || "N/A"} <br />
                        <strong>Name:</strong> {reservation.name || "N/A"} <br />
                        <strong>Date:</strong>{" "}
                        {reservation.date
                          ? new Date(reservation.date).toLocaleString()
                          : "N/A"}{" "}
                        <br />
                        <strong>Number of Persons:</strong>{" "}
                        {reservation.numPersons || "N/A"} <br />
                        <strong>Time Arriving:</strong> {reservation.timeArriving || "N/A"} <br />
                        <strong>Time Leaving:</strong> {reservation.timeLeaving || "N/A"} <br />
                        <strong>Phone:</strong> {reservation.phone || "N/A"} <br />
                        <em>{getStatusMessage(reservation.status || "pending")}</em>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Button
                className={btnClass}
                onClick={() => navigate("/reservation")}
              >
                {text.makeNewReservation || "Make a New Reservation"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>{text.noReservations || "No reservations found."}</p>
            <Button
              className={btnClass}
              onClick={() => navigate("/reservation")}
            >
              {text.makeReservation || "Make a Reservation"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservationsPage;