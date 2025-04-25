import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import TableSelection from "../TableSelection/TableSelection";
import ReservationForm from "../ReservationForm/ReservationForm";
import { ThemeContext } from "../../Context/ThemeContext";

const ReservationPage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div className={` ${bgColor} ${textColor} py-5 rounded`}>
      <div className="container">
        <h1 className="text-center mb-4">{text.reservationTitle}</h1>

        <div className="row d-flex flex-column justify-content-center align-items-center">
          <div className="col-md-6 mb-4">
            <TableSelection
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
            />
          </div>

          <div className="col-md-6">
            <h2 className="text-center">{text.reservationForm}</h2>
            <ReservationForm
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
