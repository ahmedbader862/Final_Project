import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import"./ReservationForm.css";

const ReservationForm = ({ selectedTable, setSelectedTable }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [numPersons, setNumPersons] = useState(4);
  const [timeArriving, setTimeArriving] = useState("");
  const [timeLeaving, setTimeLeaving] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setError("Please select a table.");
      return;
    }

    // التحقق من توفر الطاولة
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

    // إضافة الحجز إلى Firestore
    await addDoc(reservationsRef, {
      id: selectedTable,
      name,
      date,
      numPersons,
      timeArriving,
      timeLeaving,
    });

    alert("Reservation successful!");
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
      <h2 className="text-white text-center mb-3">Reservation Form</h2>
      {selectedTable && <p>Selected Table: {selectedTable}</p>}
      <form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
        <input className="form-control text-white name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="form-control" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <select className="form-control" value={numPersons} onChange={(e) => setNumPersons(Number(e.target.value))}>
          <option value={4}>4 Persons</option>
          <option value={6}>6 Persons</option>
        </select>
        <input className="form-control" type="time" value={timeArriving} onChange={(e) => setTimeArriving(e.target.value)} required />
        <input className="form-control" type="time" value={timeLeaving} onChange={(e) => setTimeLeaving(e.target.value)} required />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="btn btn-outline-light mt-4" type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationForm;
