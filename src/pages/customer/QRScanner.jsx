import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Zap, RefreshCw, Scan, AlertCircle, Upload } from "lucide-react";

export const QRScanner = ({ isOpen, onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanStatus, setScanStatus] = useState("Initializing...");
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadQRScanner();
    }
    return () => {
      stopCamera();
      stopScanning();
    };
  }, [isOpen]);

  const loadQRScanner = async () => {
    // Load jsQR from CDN
    if (!window.jsQR) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        console.log("jsQR loaded successfully");
      } catch (err) {
        console.error("Failed to load jsQR:", err);
        setError("Failed to load scanner library");
        return;
      }
    }
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setScanning(true);
          setScanStatus("📷 Camera ready - Scanning...");
          setError(null);
          startAutoScan();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera not accessible");
      setScanStatus("❌ Camera denied - Use file upload or manual entry");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const startAutoScan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          
          if (code) {
            setScanStatus("✅ QR Code Detected!");
            
            // Draw box around QR code
            drawLine(ctx, code.location.topLeftCorner, code.location.topRightCorner, "#00ff00");
            drawLine(ctx, code.location.topRightCorner, code.location.bottomRightCorner, "#00ff00");
            drawLine(ctx, code.location.bottomRightCorner, code.location.bottomLeftCorner, "#00ff00");
            drawLine(ctx, code.location.bottomLeftCorner, code.location.topLeftCorner, "#00ff00");
            
            if (navigator.vibrate) navigator.vibrate(200);
            
            stopScanning();
            setTimeout(() => {
              stopCamera();
              onScan(code.data);
            }, 500);
            return;
          } else {
            setScanStatus("🔍 Scanning... Point QR code at camera");
          }
        }
      }
      scanIntervalRef.current = requestAnimationFrame(tick);
    };
    
    tick();
  };

  const drawLine = (ctx, begin, end, color) => {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      cancelAnimationFrame(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setScanStatus("📷 Processing image...");
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          
          if (code) {
            setScanStatus("✅ QR Code Found!");
            if (navigator.vibrate) navigator.vibrate(200);
            setTimeout(() => {
              stopCamera();
              onScan(code.data);
            }, 500);
          } else {
            setScanStatus("❌ No QR code found in image");
            setTimeout(() => setScanStatus("📷 Camera ready - Scanning..."), 2000);
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleManualScan = () => {
    if (manualCode.trim()) {
      stopScanning();
      stopCamera();
      onScan(manualCode.trim());
      setManualCode("");
    }
  };

  const restartCamera = () => {
    stopCamera();
    stopScanning();
    setScanStatus("Restarting...");
    setTimeout(() => startCamera(), 300);
  };

  const handleDemoScan = (code) => {
    stopScanning();
    stopCamera();
    onScan(code);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-3xl">
          <button
            onClick={() => {
              stopCamera();
              stopScanning();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Scan className={`w-7 h-7 text-white ${scanning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">QR Scanner</h2>
              <p className="text-blue-100 text-sm">Multiple scan methods</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          
          {/* Camera View */}
          <div className="relative bg-black rounded-2xl overflow-hidden mb-4 shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-80 object-cover"
            />
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            
            {/* Scanner Overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-400 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-400 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>
                  <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-xl"></div>
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="absolute top-4 left-0 right-0 flex justify-center px-4">
              <div className={`${error ? 'bg-red-600' : 'bg-black'} bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-full`}>
                <span className="text-white text-sm font-medium">{error || scanStatus}</span>
              </div>
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
              {scanning && (
                <div className="bg-green-600 bg-opacity-80 px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-bold">SCANNING</span>
                </div>
              )}
              
              <button
                onClick={restartCamera}
                className="bg-black bg-opacity-60 backdrop-blur-sm hover:bg-opacity-80 p-2 rounded-full transition-all"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Camera Issue</p>
                  <p className="text-xs text-red-700">
                    Use file upload or manual entry below instead.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload QR Image */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-5 mb-4">
            <label className="block text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              📸 Upload QR Code Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Choose Image from Device
            </button>
            <p className="text-xs text-indigo-700 text-center mt-2">
              Best for desktop - upload screenshot or photo of QR code
            </p>
          </div>

          {/* Manual Entry */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              ⌨️ Manual Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                placeholder="Type or paste QR code data"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleManualScan}
                disabled={!manualCode.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Demo Codes */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              🎯 Quick Test Demo Codes
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoScan("PRODUCT-ABC-123")}
                className="bg-white hover:bg-purple-100 border-2 border-purple-300 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              >
                📦 Product
              </button>
              <button
                onClick={() => handleDemoScan("ORDER-2024-5678")}
                className="bg-white hover:bg-purple-100 border-2 border-purple-300 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              >
                🛒 Order
              </button>
              <button
                onClick={() => handleDemoScan("https://example.com/qr")}
                className="bg-white hover:bg-purple-100 border-2 border-purple-300 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              >
                🔗 URL
              </button>
              <button
                onClick={() => handleDemoScan("PAYMENT-XYZ-9999")}
                className="bg-white hover:bg-purple-100 border-2 border-purple-300 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              >
                💳 Payment
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};