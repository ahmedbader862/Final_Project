import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../../Context/ThemeContext";
import "./ReservationForm.css";
import { useSelector } from "react-redux";
import { Alert, Spinner } from "react-bootstrap";
import clsx from "clsx";

const ReservationForm = ({ selectedTable, setSelectedTable }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [numPersons, setNumPersons] = useState(4);
  const [timeArriving, setTimeArriving] = useState("");
  const [timeLeaving, setTimeLeaving] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const inputClass = theme === "dark" ? "input-dark" : "input-light";
  const btnClass = theme === "dark" ? "btn-custom-dark" : "btn-custom-light";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("mustBeLoggedIn");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const generateShortId = async () => {
    const reservationsRef = collection(db, "reservations");
    let newId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 20;

    while (!isUnique && attempts < maxAttempts) {
      const random = Math.floor(1000 + Math.random() * 9000);
      newId = `${Date.now().toString().slice(-6)}${random}`;
      try {
        const q = query(reservationsRef, where("reservationId", "==", newId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          isUnique = true;
        }
      } catch (err) {
        console.error("Error checking ID uniqueness:", err);
        throw new Error("Failed to verify reservation ID.");
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique reservation ID.");
    }

    return newId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);

    if (!selectedTable) {
      setError("pleaseSelectTable");
      setIsLoading(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("mustBeLoggedIn");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("invalidPhone");
      setIsLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      setError("pastDate");
      setIsLoading(false);
      return;
    }

    if (timeArriving && timeLeaving) {
      if (timeLeaving <= timeArriving) {
        setError("invalidTimeRange");
        setIsLoading(false);
        return;
      }

      const [arriveHours, arriveMinutes] = timeArriving.split(":").map(Number);
      const [leaveHours, leaveMinutes] = timeLeaving.split(":").map(Number);
      const arriveTime = new Date();
      arriveTime.setHours(arriveHours, arriveMinutes, 0, 0);
      const leaveTime = new Date();
      leaveTime.setHours(leaveHours, leaveMinutes, 0, 0);

      const durationMinutes = (leaveTime - arriveTime) / (1000 * 60);
      if (durationMinutes > 120) {
        setError("maxReservationDuration");
        setIsLoading(false);
        return;
      }
    }

    try {
      const reservationsRef = collection(db, "reservations");
      const q = query(
        reservationsRef,
        where("tableId", "==", selectedTable),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("tableAlreadyReserved");
        setIsLoading(false);
        return;
      }

      const newReservationId = await generateShortId();
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

      setSuccessMessage(text.reservationSuccess || "Reservation successful!");
      setTimeout(() => {
        navigate("/my-reservations");
        setName("");
        setDate("");
        setNumPersons(4);
        setTimeArriving("");
        setTimeLeaving("");
        setPhone("");
        setSelectedTable(null);
        setValidated(false);
      }, 3000);
    } catch (error) {
      console.error("Reservation error:", error);
      setError("failedToReserve");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`reservation-form-container py-5 ${theme === "dark" ? "bg-dark-custom" : "bg-light-custom"}`}>
      <div className="container">
        <h2 className={`text-center mb-3 ${textColor}`}>
          {text.reservationFormTitle || (currentLange === "Ar" ? "نموذج الحجز" : "Reservation Form")}
        </h2>
        {selectedTable && (
          <p className={`text-center mb-3 ${textColor}`}>
            {text.selectedTable || (currentLange === "Ar" ? "الطاولة المختارة" : "Selected Table")}: {selectedTable}
          </p>
        )}
        <form
          className="d-flex flex-column gap-3 needs-validation"
          noValidate
          onSubmit={handleSubmit}
          validated={validated.toString()}
        >
          <div className="form-group">
            <label htmlFor="name" className={textColor}>
              {text?.name || (currentLange === "Ar" ? "الاسم" : "Name")}
            </label>
            <input
              id="name"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !name })}
              type="text"
              placeholder={text?.name || (currentLange === "Ar" ? "الاسم" : "Name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Name"
            />
            <div className="invalid-feedback">
              {text?.nameRequired || (currentLange === "Ar" ? "الاسم مطلوب" : "Name is required")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date" className={textColor}>
              {text?.date || (currentLange === "Ar" ? "التاريخ" : "Date")}
            </label>
            <input
              id="date"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !date })}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              aria-label="Date"
            />
            <div className="invalid-feedback">
              {text?.dateRequired || (currentLange === "Ar" ? "التاريخ مطلوب" : "Date is required")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="numPersons" className={textColor}>
              {text?.numberOfPersons || (currentLange === "Ar" ? "عدد الأشخاص" : "Number of Persons")}
            </label>
            <select
              id="numPersons"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !numPersons })}
              value={numPersons}
              onChange={(e) => setNumPersons(Number(e.target.value))}
              required
              aria-label="Number of Persons"
            >
              {[2, 4, 6, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {text?.persons || (currentLange === "Ar" ? "أشخاص" : "Persons")}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">
              {text?.numPersonsRequired || (currentLange === "Ar" ? "عدد الأشخاص مطلوب" : "Number of persons is required")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="timeArriving" className={textColor}>
              {text?.timeArriving || (currentLange === "Ar" ? "وقت الوصول" : "Arriving Time")}
            </label>
            <input
              id="timeArriving"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !timeArriving })}
              type="time"
              value={timeArriving}
              onChange={(e) => setTimeArriving(e.target.value)}
              required
              aria-label="Arriving Time"
            />
            <div className="invalid-feedback">
              {text?.timeArrivingRequired || (currentLange === "Ar" ? "وقت الوصول مطلوب" : "Arriving time is required")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="timeLeaving" className={textColor}>
              {text?.timeLeaving || (currentLange === "Ar" ? "وقت المغادرة" : "Leaving Time")}
            </label>
            <input
              id="timeLeaving"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !timeLeaving })}
              type="time"
              value={timeLeaving}
              onChange={(e) => setTimeLeaving(e.target.value)}
              required
              aria-label="Leaving Time"
            />
            <div className="invalid-feedback">
              {text?.timeLeavingRequired || (currentLange === "Ar" ? "وقت المغادرة مطلوب" : "Leaving time is required")}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone" className={textColor}>
              {text?.phone || (currentLange === "Ar" ? "رقم الهاتف" : "Phone Number")}
            </label>
            <input
              id="phone"
              className={clsx("form-control", inputClass, { 'is-invalid': validated && !phone })}
              type="tel"
              placeholder={text?.phone || (currentLange === "Ar" ? "رقم الهاتف" : "Phone Number")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="\+?\d{10,15}"
              aria-label="Phone Number"
            />
            <div className="invalid-feedback">
              {text?.phoneInvalid || (currentLange === "Ar" ? "رقم الهاتف غير صالح" : "Please enter a valid phone number (10-15 digits)")}
            </div>
          </div>
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
          <button
            className={clsx("btn mt-4", btnClass)}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {text?.reserving || (currentLange === "Ar" ? "جارٍ الحجز" : "Reserving")}
              </>
            ) : (
              text?.reserve || (currentLange === "Ar" ? "حجز" : "Reserve")
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;