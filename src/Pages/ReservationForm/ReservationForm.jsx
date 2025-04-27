import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { ThemeContext } from "../../Context/ThemeContext";
import "./ReservationForm.css";
import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

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
    setError(""); // Clear previous errors

    if (!selectedTable) {
      setError("pleaseSelectTable");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("mustBeLoggedIn");
      return;
    }

    // Validate time range
    if (timeArriving && timeLeaving && timeLeaving <= timeArriving) {
      setError("invalidTimeRange");
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
      setError("tableAlreadyReserved");
      return;
    }

    try {
      // Generate a unique 6-digit reservation ID
      const newReservationId = await generateShortId();

      // Create the document with the custom ID
      const reservationDocRef = doc(reservationsRef, newReservationId);
      const reservationData = {
        reservationId: newReservationId,
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
      setError("failedToReserve");
    }
  };

  return (
    <div className="py-5">
      <h2 className={`text-center mb-3 ${textColor}`}>{text.reservationFormTitle}</h2>
      {selectedTable && <p className={textColor}>{text.selectedTable}: {selectedTable}</p>}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {text[error] || 
            (error === "invalidTimeRange" 
              ? (currentLange === "Ar" ? "وقت المغادرة يجب أن يكون بعد وقت الوصول" : "Leaving time must be after arriving time")
              : error === "failedToReserve"
              ? (currentLange === "Ar" ? "فشل في إجراء الحجز" : "Failed to make reservation")
              : error === "pleaseSelectTable"
              ? (currentLange === "Ar" ? "يرجى اختيار طاولة" : "Please select a table")
              : error === "mustBeLoggedIn"
              ? (currentLange === "Ar" ? "يجب تسجيل الدخول لإجراء الحجز" : "You must be logged in to make a reservation")
              : error === "tableAlreadyReserved"
              ? (currentLange === "Ar" ? "هذه الطاولة محجوزة بالفعل" : "This table is already reserved")
              : error)}
        </Alert>
      )}
      <form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className={textColor}>
            {text?.name || (currentLange === "Ar" ? "الاسم" : "Name")}
          </label>
          <input
            id="name"
            className={`form-control ${inputBg}`}
            type="text"
            placeholder={text?.name || (currentLange === "Ar" ? "الاسم" : "Name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date" className={textColor}>
            {text?.date || (currentLange === "Ar" ? "التاريخ" : "Date")}
          </label>
          <input
            id="date"
            className={`form-control ${inputBg}`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numPersons" className={textColor}>
            {text?.numberOfPersons || (currentLange === "Ar" ? "عدد الأشخاص" : "Number of Persons")}
          </label>
          <select
            id="numPersons"
            className={`form-control ${inputBg}`}
            value={numPersons}
            onChange={(e) => setNumPersons(Number(e.target.value))}
          >
            <option value={4}>4 {text?.persons || (currentLange === "Ar" ? "أشخاص" : "Persons")}</option>
            <option value={6}>6 {text?.persons || (currentLange === "Ar" ? "أشخاص" : "Persons")}</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="timeArriving" className={textColor}>
            {text?.timeArriving || (currentLange === "Ar" ? "وقت الوصول" : "Arriving Time")}
          </label>
          <input
            id="timeArriving"
            className={`form-control ${inputBg}`}
            type="time"
            value={timeArriving}
            onChange={(e) => setTimeArriving(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeLeaving" className={textColor}>
            {text?.timeLeaving || (currentLange === "Ar" ? "وقت المغادرة" : "Leaving Time")}
          </label>
          <input
            id="timeLeaving"
            className={`form-control ${inputBg}`}
            type="time"
            value={timeLeaving}
            onChange={(e) => setTimeLeaving(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className={textColor}>
            {text?.phone || (currentLange === "Ar" ? "رقم الهاتف" : "Phone Number")}
          </label>
          <input
            id="phone"
            className={`form-control ${inputBg}`}
            type="tel"
            placeholder={text?.phone || (currentLange === "Ar" ? "رقم الهاتف" : "Phone Number")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button className={`btn mt-4 ${btnClass}`} type="submit">
          {text?.reserve || (currentLange === "Ar" ? "حجز" : "Reserve")}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;