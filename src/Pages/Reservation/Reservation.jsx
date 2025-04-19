import React, { useState, useContext } from "react";
import TableSelection from "../TableSelection/TableSelection";
import ReservationForm from "../ReservationForm/ReservationForm";
import { ThemeContext } from "../../Context/ThemeContext";

const ReservationPage = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const { theme } = useContext(ThemeContext);

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div className={` ${bgColor} ${textColor} py-5 rounded`}>
      <div className="container">
      <h1 className="text-center mb-4">Table Reservation</h1>

      <div className="row d-flex flex-column justify-content-center align-items-center">
        {/* قسم اختيار الطاولة */}
        <div className="col-md-6 mb-4">
          <TableSelection
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        </div>

        {/* قسم الحجز */}
        <div className="col-md-6">
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
