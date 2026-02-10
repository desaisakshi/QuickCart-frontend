import React, { useEffect, useState } from "react";
import { ShoppingCart, Scan, Trash2, Minus, Plus } from "lucide-react";
import { QRScanner } from "./QRScanner.jsx";

import {
  addToCartAPI,
  getCartAPI,
  updateQtyAPI,
  removeCartItemAPI,
} from "./action/cart.js";

import { createPaymentOrderAPI } from "./action/payment.js";
import { generateQrAPI, completeOrderAPI } from "./action/order.js";

import { loadRazorpay } from "../../utils/razorpay.js";

export const CustomerDashboard = () => {
  const [user, setUser] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderQR, setOrderQR] = useState(null);

  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("cart");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    fetchCart();
  }, []);

  // LOAD CART
  const fetchCart = async () => {
    try {
      const data = await getCartAPI();
      setCartItems(data.items || []);

      let total = 0;
      data.items?.forEach((i) => (total += i.price * i.qty));
      setCartTotal(total);
    } catch (err) {
      console.error(err);
    }
  };

  // PARSE SCANNED PRODUCT
  const parseScannedProduct = (text) => {
    const lines = text.split("\n");
    const result = {};
    lines.forEach((line) => {
      const [key, ...value] = line.split(":");
      if (key && value) {
        result[key.trim().toLowerCase()] = value.join(":").trim();
      }
    });
    return result;
  };

  // HANDLE QR SCAN
  const handleScan = async (code) => {
    const product = parseScannedProduct(code);

    const payload = {
      productId: product?.sku,
      name: product?.name,
      price: Number(product?.discount || 0),
      qty: 1,
    };

    try {
      await addToCartAPI(payload);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }

    setScannerOpen(false);
  };

  // UPDATE QTY
  const handleUpdateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
      await updateQtyAPI(productId, qty);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // REMOVE ITEM
  const handleRemove = async (productId) => {
    try {
      await removeCartItemAPI(productId);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // PROCESS PAYMENT
 const handlePayment = async () => {
  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("Razorpay failed to load");
    return;
  }

  // GET RAZORPAY ORDER FROM BACKEND
  let orderData;
  try {
    orderData = await createPaymentOrderAPI({ amount: cartTotal });
    console.log("orderData:", orderData);
  } catch (err) {
    console.log("Payment Order Error:", err);
    return alert("Could not create payment order");
  }

  const options = {
     key: "rzp_test_RqDi9Rnc0on7O9",
    amount: orderData.amount,
    currency: "INR",
    order_id: orderData.orderId,
    method: {
    upi: true,       // ENABLE UPI
    card: true,
    netbanking: true,
  },
    handler: async function (response) {
      try {
        // GENERATE QR
        const qrRes = await generateQrAPI({
          orderId: orderData.orderId,
          amount: cartTotal,
        });

        setOrderQR(qrRes.qrUrl);

        // COMPLETE ORDER
        await completeOrderAPI({
          paymentId: response.razorpay_payment_id,
          orderId: orderData.orderId,
          amount: cartTotal,
          qrUrl: qrRes.qrUrl,
        });

        // SAVE COMPLETED ORDER
        setCompletedOrders((prev) => [
          ...prev,
          {
            orderId: orderData.orderId,
            amount: cartTotal,
            qr: qrRes.qrUrl,
            date: new Date(),
          },
        ]);

        // CLEAR CART + SHOW SUCCESS
        setCartItems([]);
        setCartTotal(0);
        setShowSuccess(true);
      } catch (err) {
        console.log("ERROR in payment handler:", err);
      }
    },
  };
  loadRazorpay()

  new window.Razorpay(options).open();
};


  // SUCCESS VIEW (QR CODE)
  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <img src={orderQR} className="w-64 h-64 shadow mb-6" />

        <button
          onClick={() => {
            setShowSuccess(false);
            setActiveTab("completed");
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow"
        >
          View Completed Orders
        </button>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
          </div>

          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Scan Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl mb-8 shadow-lg">
          <h2 className="text-white text-2xl font-bold flex items-center gap-3">
            <Scan className="w-7 h-7" /> Quick Scan
          </h2>
          <p className="text-blue-100 mb-6">
            Scan product QR codes and add them to your cart instantly.
          </p>

          <button
            onClick={() => setScannerOpen(true)}
            className="bg-white text-blue-600 font-semibold px-7 py-3 rounded-xl shadow hover:bg-blue-50 flex items-center gap-2"
          >
            <Scan className="w-5 h-5" /> Start Scanning
          </button>
        </div>

        {/* CART TAB */}
        {activeTab === "cart" && (
          <>
            {/* CART SUMMARY */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-indigo-600" />
                Your Cart
              </h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-5 rounded-xl">
                  <p className="text-gray-600 text-sm">Items</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {cartItems.length}
                  </p>
                </div>

                <div className="bg-green-50 p-5 rounded-xl">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{cartTotal}
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  className="bg-green-600 text-white font-semibold rounded-xl shadow px-6 py-4 hover:bg-green-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* CART ITEMS LIST */}
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-5 mb-4"
              >
                <div className="flex items-center justify-between">
                  {/* Product Info */}
                  <div>
                    <p className="text-lg font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      SKU: {item.productId}
                    </p>
                    <p className="text-xl text-green-600 font-bold">
                      ₹{item.price * item.qty}
                    </p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateQty(item.productId, item.qty - 1)
                      }
                      className="bg-gray-200 p-2 rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-bold text-lg">{item.qty}</span>

                    <button
                      onClick={() =>
                        handleUpdateQty(item.productId, item.qty + 1)
                      }
                      className="bg-green-500 text-white p-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="bg-red-500 text-white p-2 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* COMPLETED ORDERS TAB */}
        {activeTab === "completed" && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Completed Orders</h2>

            {completedOrders.map((o, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 mb-4 shadow border"
              >
                <p className="font-bold text-lg">Order ID: {o.orderId}</p>
                <p className="text-gray-600">Amount: ₹{o.amount}</p>

                <img src={o.qr} className="w-40 h-40 mt-3" />

                <p className="text-sm text-gray-400 mt-2">
                  {o.date.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCANNER POPUP */}
      <QRScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default CustomerDashboard;
