"use client";
import { useState } from "react";

export default function FilterBar({ onFilter }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApply = () => {
    onFilter({
      fromDate,
      toDate,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4 items-center">
      {/* From Date */}
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:ring-2 focus:ring-black"
      />

      {/* To Date */}
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-black text-sm focus:ring-2 focus:ring-black"
      />

      {/* Apply */}
      <button
        onClick={handleApply}
        className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
      >
        Apply
      </button>
    </div>
  );
}
