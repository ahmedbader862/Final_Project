import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { ThemeContext } from "../../Context/ThemeContext";
import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import "./ReservationForm.css";

const ReservationForm = ({ selectedTable, setSelectedTable }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [numPersons, setNumPersons] = useState(4);
  const [timeArriving, setTimeArriving] = useState("");
  const [timeLeaving, setTimeLeaving] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const inputBg = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";
  const btnClass = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";

  // Function to generate a 6-digit random ID
  const generateShortId = async () => {
    const reservationsRef = collection(db, "reservations");
    let newId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate a 6-digit number (100000 to 999999)
      newId = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if this ID already exists
      const q = query(reservationsRef, where("reservationId", "==", newId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique reservation ID after multiple attempts.");
    }

    return newId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setError("Please select a table.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to make a reservation.");
      return;
    }

    const reservationsRef = collection(db, "reservations");
    const q = query(
      reservationsRef,
      where("tableId", "==", selectedTable),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setError("This table is already reserved.");
      return;
    }

    try {
      // Generate a unique 6-digit reservation ID
      const newReservationId = await generateShortId();

      // Create the document with the custom ID
      const reservationDocRef = doc(reservationsRef, newReservationId);
      const reservationData = {
        reservationId: newReservationId, // Store the custom ID in the document
        tableId: selectedTable,
        name,
        date,
        numPersons,
        timeArriving,
        timeLeaving,
        phone,
        status: "pending",
        userId: user.uid,
      };

      await setDoc(reservationDocRef, reservationData);

      setSuccessMessage(text.reservationSuccess);
      setTimeout(() => {
        navigate("/my-reservations");
      }, 2000);

      setName("");
      setDate("");
      setNumPersons(4);
      setTimeArriving("");
      setTimeLeaving("");
      setPhone("");
      setSelectedTable(null);
      setError("");
    } catch (error) {
      setError("Failed to make reservation: " + error.message);
    }
  };

  return (
    <div className="my-5">
      <h2 className={`text-center mb-3 ${textColor}`}>{text.reservationFormTitle}</h2>
      {selectedTable && <p className={textColor}>{text.selectedTable}: {selectedTable}</p>}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {text[error] || error}
        </Alert>
      )}
      <form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
        <input
          className={`form-control name ${inputBg}`}
          type="text"
          placeholder={text.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={`form-control ${inputBg}`}
          type="date"
          placeholder={text.datePlaceholder}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          className={`form-control ${inputBg}`}
          value={numPersons}
          onChange={(e) => setNumPersons(Number(e.target.value))}
        >
          <option value={4}>{text.numPersonsPlaceholder} (4)</option>
          <option value={6}>{text.numPersonsPlaceholder} (6)</option>
        </select>
        <input
          className={`form-control ${inputBg}`}
          type="time"
          placeholder={text.timeArrivingPlaceholder}
          value={timeArriving}
          onChange={(e) => setTimeArriving(e.target.value)}
          required
        />
        <input
          className={`form-control ${inputBg}`}
          type="time"
          placeholder={text.timeLeavingPlaceholder}
          value={timeLeaving}
          onChange={(e) => setTimeLeaving(e.target.value)}
          required
        />
        <input
          className={`form-control ${inputBg}`}
          type="tel"
          placeholder={text.phonePlaceholder || "Phone Number"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button className={`btn mt-4 ${btnClass}`} type="submit">
          {text.reserveButton}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;