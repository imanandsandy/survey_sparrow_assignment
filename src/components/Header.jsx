import React from "react";

const Header = ({ month, year, onPrev, onNext }) => {
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={onPrev} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
      <h2 className="text-xl font-bold">{monthName} {year}</h2>
      <button onClick={onNext} className="px-3 py-1 bg-gray-200 rounded">Next</button>
    </div>
  );
};

export default Header;
