import React, { useState } from "react";
import { QRScanner } from "./QRScanner.jsx";
import { verifyOrderAPI } from "./action/checker.js";
import { Search, Scan, CheckCircle, XCircle, Loader } from "lucide-react";

export const CheckerDashboard = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  // HANDLE QR SCAN
  const handleScan = async (data) => {
    try {
      setLoading(true);
      setError("");
      setOrderData(null);

      const parsed = JSON.parse(data); // QR contains JSON
      const orderId = parsed.orderId;

      const res = await verifyOrderAPI(orderId);

      setOrderData(res.order);
    } catch (err) {
      setError(err.message || "Invalid QR Code");
    } finally {
      setScannerOpen(false);
      setLoading(false);
    }
  };

  return (
 
     <div className="bg-white shadow p-4 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Search className="text-indigo-600 w-6 h-6" />
            Checker Dashboard
          </h1>

          <button
            onClick={() => navigate("/checker-history")}
            className="text-indigo-600 hover:text-indigo-800 font-medium underline"
          >
            History Report
          </button>
        </div>

      
      {/* Header */}
      {/* <div className="bg-white shadow p-4 rounded-xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="text-indigo-600 w-6 h-6" />
          Checker Dashboard
        </h1>
        <p className="text-gray-500">Scan order QR and verify customer order</p>
      </div> */}

      {/* Scan Button */}
      <div className="mb-6">
        <button
          onClick={() => setScannerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-md"
        >
          <Scan className="w-5 h-5" /> Scan Order QR
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <Loader className="animate-spin w-8 h-8 text-indigo-600 mx-auto" />
          <p className="mt-3 text-gray-600">Verifying order...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Verified Order Details */}
      {orderData && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Order Verified</h2>
          </div>

          <p className="text-gray-600 mb-2">
            <strong>Order ID:</strong> {orderData.orderId}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Payment ID:</strong> {orderData.paymentId}
          </p>

          <p className="text-gray-800 text-2xl font-bold mb-4">
            Total Amount: ₹{orderData.amount}
          </p>

          {/* Items */}
          <h3 className="text-lg font-semibold mb-2">Items:</h3>
          {orderData.items.map((item, index) => (
            <div key={index} className="border p-3 rounded-lg mb-2">
              <p className="font-bold">{item.name}</p>
              <p className="text-gray-600">Qty: {item.qty}</p>
              <p className="text-green-600 font-semibold">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>
      )}

      <QRScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default CheckerDashboard;
