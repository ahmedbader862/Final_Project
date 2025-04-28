import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ThemeContext } from "../../Context/ThemeContext";
import "./UserReservationsPage.css";
import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import clsx from "clsx";

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 6;

  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const navigate = useNavigate();

  const bgColor = theme === "dark" ? "bg-dark-custom" : "bg-light-custom";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const cardClass = theme === "dark" ? "bg-card-dark text-white" : "bg-card-light text-dark";

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError(text?.mustBeLoggedIn || "You must be logged in to view your reservations.");
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
        setCurrentPage(1);
      },
      (error) => {
        setError((text?.failedLoadReservations || "Failed to load reservations: ") + error.message);
      }
    );

    return () => unsubscribe();
  }, [text]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "var(--accent)"; // #FF6B6B
      case "accepted":
        return "var(--primary)"; // #007bff
      case "rejected":
        return "var(--danger)"; // #B73E3E
      default:
        return "var(--text-light)"; // #ffffff
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return text?.pendingMessage || "Awaiting admin approval. You’ll be notified once confirmed.";
      case "accepted":
        return text?.acceptedMessage || "Your reservation is confirmed! We look forward to seeing you.";
      case "rejected":
        return text?.rejectedMessage || "Sorry, your reservation was not approved. Please try a different time or table.";
      default:
        return "";
    }
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className={clsx("py-5 rounded mt-5", bgColor, textColor, { "rtl-text": currentLange === "Ar" })}>
      <div className="container">
        <h1 className="text-center mb-4">{text?.myReservationsTitle || "My Reservations"}</h1>

        {error && (
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            className={clsx("custom-alert", { "rtl-text": currentLange === "Ar" })}
          >
            {error}
          </Alert>
        )}

        {reservations.length > 0 ? (
          <>
            <Row>
              {currentReservations.map((reservation) => (
                <Col md={6} lg={6} className="mb-4" key={reservation.id}>
                  <Card className={clsx("border-0 shadow-sm", cardClass)}>
                    <Card.Body>
                      <Card.Title className={clsx("d-flex justify-content-between", { "flex-row-reverse": currentLange === "Ar" })}>
                        <span>
                          {text?.tableIdLabel || "Table ID"}: {reservation.reservationId || reservation.id || (text?.unknown || "Unknown")}
                        </span>
                        <span
                          style={{
                            color: getStatusColor(reservation.status),
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                          }}
                        >
                          {text[`status${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}`] || reservation.status || "pending"}
                        </span>
                      </Card.Title>
                      <Card.Text className={clsx("muted-text", { "rtl-text": currentLange === "Ar" })}>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.tableIdLabel || "Table ID"}:</strong>
                          <span className="ms-2">{reservation.tableId || "N/A"}</span>
                        </div>
                        <hr className={theme === "dark" ? "hr-dark" : "hr-light"} />
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.nameLabel || "Name"}:</strong>
                          <span className="ms-2">{reservation.name || "N/A"}</span>
                        </div>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.dateLabel || "Date"}:</strong>
                          <span className="ms-2">
                            {reservation.date
                              ? new Date(reservation.date).toLocaleString(currentLange === "Ar" ? 'ar-EG' : 'en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.numPersonsLabel || "Number of Persons"}:</strong>
                          <span className="ms-2">{reservation.numPersons || "N/A"}</span>
                        </div>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.timeArrivingLabel || "Time Arriving"}:</strong>
                          <span className="ms-2">{reservation.timeArriving || "N/A"}</span>
                        </div>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.timeLeavingLabel || "Time Leaving"}:</strong>
                          <span className="ms-2">{reservation.timeLeaving || "N/A"}</span>
                        </div>
                        <div className={clsx("d-flex", { "flex-row-reverse": currentLange === "Ar" })}>
                          <strong>{text?.phoneLabel || "Phone"}:</strong>
                          <span className="ms-2">{reservation.phone || "N/A"}</span>
                        </div>
                        <div className="text-center mt-3">
                          <em>{getStatusMessage(reservation.status || "pending")}</em>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className={clsx("d-flex justify-content-center mt-5", { "flex-row-reverse": currentLange === "Ar" })}>
              <nav>
                <ul className="pagination ">
                  <li className={clsx("page-item", { disabled: currentPage === 1 })}>
                    <button
                      className={clsx("page-link btn-outline-accent", { "disabled": currentPage === 1 })}
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      {text?.previous || "Previous"}
                    </button>
                  </li>
                  {getPageNumbers().map(number => (
                    <li key={number} className={clsx("page-item", { active: currentPage === number })}>
                      <button
                        className={clsx("page-link btn-outline-accent", { "page-active": currentPage === number })}
                        onClick={() => handlePageChange(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={clsx("page-item", { disabled: currentPage === totalPages })}>
                    <button
                      className={clsx("page-link btn-outline-accent", { "disabled": currentPage === totalPages })}
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      {text?.next || "Next"}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="text-center mt-4">
              <Button
                className="btn-outline-accent"
                onClick={() => navigate("/reservation")}
              >
                {text?.makeNewReservation || "Make a New Reservation"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>{text?.noReservations || "No reservations found."}</p>
            <Button
              className="btn-outline-accent"
              onClick={() => navigate("/reservation")}
            >
              {text?.makeReservation || "Make a Reservation"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservationsPage;