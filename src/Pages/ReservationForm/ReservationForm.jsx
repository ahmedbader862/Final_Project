import React, { useState, useContext } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ThemeContext } from "../../Context/ThemeContext"; // تأكد من المسار
import { useSelector } from "react-redux";
import "./ReservationForm.css";

const ReservationForm = ({ selectedTable, setSelectedTable }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [numPersons, setNumPersons] = useState(4);
  const [timeArriving, setTimeArriving] = useState("");
  const [timeLeaving, setTimeLeaving] = useState("");
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);

  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const inputBg = theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";
  const btnClass = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setError("Please select a table.");
      return;
    }

    const reservationsRef = collection(db, "reservations");
    const q = query(
      reservationsRef,
      where("id", "==", selectedTable),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setError("This table is already reserved.");
      return;
    }

    await addDoc(reservationsRef, {
      id: selectedTable,
      name,
      date,
      numPersons,
      timeArriving,
      timeLeaving,
    });

    alert(text.reservationSuccess);
    setName("");
    setDate("");
    setNumPersons(4);
    setTimeArriving("");
    setTimeLeaving("");
    setSelectedTable(null);
    setError("");
  };

  return (
    <div className="my-5">
      <h2 className={`text-center mb-3 ${textColor}`}>{text.reservationFormTitle}</h2>
      {selectedTable && <p className={textColor}>{text.selectedTable}: {selectedTable}</p>}
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
        {error && <p style={{ color: "red" }}>{text[error]}</p>}
        <button className={`btn mt-4 ${btnClass}`} type="submit">
          {text.reserveButton}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
