import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../Context/ThemeContext"; // تأكد من المسار
import "./TableSelection.css";

const TableSelection = ({ selectedTable, setSelectedTable }) => {
  const [hoveredTable, setHoveredTable] = useState(null);
  const { theme } = useContext(ThemeContext);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const tables = [
    { id: 1, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 2, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 3, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 4, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 5, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 6, seats: 4, image: "https://i.postimg.cc/fR12ckGT/table-4-removebg-preview.png" },
    { id: 7, seats: 6, image: "https://i.postimg.cc/sX4TCmvv/table-6-removebg-preview.png" },
    { id: 8, seats: 6, image: "https://i.postimg.cc/sX4TCmvv/table-6-removebg-preview.png" },
  ];

  const h2Color = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div className="my-5 reservation">
      <h2 className={`text-center my-4 ${h2Color}`}>{text.selectTableTitle}</h2>
      <div className="row tables d-flex justify-content-center">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-img col-lg-4 col-md-6 col-sm-12 mx-auto d-flex flex-column justify-content-center align-items-center ${selectedTable === table.id ? "selected" : ""}`}
            onClick={() => setSelectedTable(table.id)}
          >
            <img
              src={table.image}
              alt={`${text.tableFor} ${table.seats} ${text.persons}`}
              onMouseEnter={() => setHoveredTable(table.id)}
              onMouseLeave={() => setHoveredTable(null)}
            />
            <p className="text-white text-center ">
            {text?.tableFor || (currentLange === "Ar" ? "طاولة لـ" : "Table for")} {table.seats} {text?.persons || (currentLange === "Ar" ? "أشخاص" : "Persons")}
            </p>           
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
