import React, { useState } from "react";
import TableSelection from "../TableSelection/TableSelection";
import ReservationForm from "../ReservationForm/ReservationForm";

const ReservationPage = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="container text-white">
      <h1 className="text-center text-center ">Table Reservation</h1>
      <div className="row d-flex flex-column justify-content-center align-items-center">
        
         {/* قسم اختيار الطاولة */}
         <div className="col-md-6">
          <TableSelection selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
        </div>

        {/* قسم الحجز */}
        <div className="col-md-6">
          <ReservationForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
        </div>

       
      </div>
    </div>
  );
};

export default ReservationPage;