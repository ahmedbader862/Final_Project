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
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 6;

  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const navigate = useNavigate();

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const cardBg = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";
  const btnClass = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";
  const pageBtnClass = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";

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
        setCurrentPage(1); // Reset to first page when reservations change
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

  // Pagination logic
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
    <div className={` ${bgColor} ${textColor} py-5 rounded mt-5`}>
      <div className="container">
        <h1 className="text-center mb-4">{text.myReservationsTitle}</h1>

        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        {reservations.length > 0 ? (
          <>
            <Row>
              {currentReservations.map((reservation) => (
                <Col md={6} lg={4} className="mb-4" key={reservation.id}>
                  <Card className={`${cardBg} border-0 shadow`}>
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-center">
                        <span>
                          {text.tableIdLabel}: {reservation.reservationId || reservation.id || "Unknown"}
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
                        <strong>{text.tableIdLabel}:</strong> {reservation.tableId || "N/A"} <br />
                        <strong>{text.nameLabel}:</strong> {reservation.name || "N/A"} <br />
                        <strong>{text.dateLabel}:</strong>{" "}
                        {reservation.date
                          ? new Date(reservation.date).toLocaleString()
                          : "N/A"}{" "}
                        <br />
                        <strong>{text.numPersonsLabel}:</strong>{" "}
                        {reservation.numPersons || "N/A"} <br />
                        <strong>{text.timeArrivingLabel}:</strong> {reservation.timeArriving || "N/A"} <br />
                        <strong>{text.timeLeavingLabel}:</strong> {reservation.timeLeaving || "N/A"} <br />
                        <strong>{text.phoneLabel}:</strong> {reservation.phone || "N/A"} <br />
                        <em>{getStatusMessage(reservation.status || "pending")}</em>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className={`page-link ${pageBtnClass}`} 
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      style={{ borderRadius: '50px', margin: '0 5px' }}
                    >
                      Previous
                    </button>
                  </li>
                  {getPageNumbers().map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                      <button 
                        className={`page-link ${pageBtnClass}`} 
                        onClick={() => handlePageChange(number)}
                        style={{ 
                          borderRadius: '50px', 
                          margin: '0 5px',
                          backgroundColor: currentPage === number ? (theme === "dark" ? '#555' : '#ddd') : '',
                          border: 'none'
                        }}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className={`page-link ${pageBtnClass}`} 
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      style={{ borderRadius: '50px', margin: '0 5px' }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="text-center mt-4">
              <Button
                className={btnClass}
                onClick={() => navigate("/reservation")}
              >
                {text.makeNewReservation}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>{text.noReservations}</p>
            <Button
              className={btnClass}
              onClick={() => navigate("/reservation")}
            >
              {text.makeReservation}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservationsPage;