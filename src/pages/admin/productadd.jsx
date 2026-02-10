import React, { useState } from 'react';
import { ShoppingBag, AlignLeft, Tag, Package, Box, Image, MapPin, Users, Calendar, DollarSign, Percent } from 'lucide-react';
import { generateQrCode, saveProduct } from './action/admin';
import { useNavigate } from 'react-router-dom';
export  function ProductAdd() {
 const [formData, setFormData] = useState({
  name: '',
  description: '',
  category: '',
  sku: '',
  stock: '',        // ✅ FIXED
  brand: '',
  image: null,
  location: '',
  supplier: '',
  warranty: '',
  discount: '',
  dateAdded: ''      // ✅ FIXED
});

const navigate = useNavigate();


  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData({
        ...formData,
        image: file
      });
    }
  };

   const isFormValid = () => {
  return (
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.category.trim() !== "" &&
    formData.sku.trim() !== "" &&
    formData.supplier.trim() !== "" &&
    formData.warranty.trim() !== "" &&
    formData.discount.trim() !== "" 
  );
};
 const generateQRCode = async () => {
  if (!isFormValid()) {
    alert("Please fill all fields before generating QR Code.");
    return;
  }

  setIsLoading(true);

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const qrData = {
      name: formData.name,
      price: formData.discount || 'N/A',
      description: formData.description
    };

    const qr = await generateQrCode(qrData);
    setQrCode(qr.qrCode);

  } catch (error) {
    console.error('Error generating QR code:', error);
  } finally {
    setIsLoading(false);
  }
};


 

  const handleSave = async() => {
    
    setFormData({
      name: '',
      description: '',
      category: '',
      sku: '',
      stock: '',
      brand: '',
      image: null,
      location: '',
      supplier: '',
      warranty: '',
      discount: ''
    });
    setFileName('No file chosen');
     const res = await saveProduct(formData);
     if(res.success){
      navigate('/')
     }
    setQrCode(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
      <div className="w-full max-w-5xl">
        <div className="bg-gradient-to-br from-blue-100/90 to-cyan-100/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/30">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 md:mb-8 animate-fade-in">
            Add Product
          </h1>

          {/* Form Grid */}
          <div className="space-y-4 md:space-y-5">
            {/* Product Name - Full Width */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Product Name:</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 resize-none border border-gray-300/50"
              />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Product Category */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Product Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* Product ID / SKU */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Brand IN'SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* QR Code Section */}
              <div className="row-span-2">
                <label className="block text-gray-900 font-medium mb-2 invisible md:visible">QR Code:</label>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col items-center justify-center h-[calc(100%-2rem)] border border-gray-300/50 min-h-[200px]">
                  {qrCode ? (
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-lg animate-scale-in"
                    />
                  ) : (
                    <button
  onClick={generateQRCode}
  disabled={!isFormValid() || isLoading}
  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 
             disabled:opacity-50 disabled:cursor-not-allowed 
             hover:from-blue-600 hover:to-cyan-600 text-white 
             font-medium rounded-lg transition-all duration-300 
             transform hover:scale-[1.02] active:scale-[0.98]"
>
  {isLoading ? 'Generating...' : 'Generate QR Code'}
</button>

                  )}
                </div>
              </div>

           

              {/* Date Added */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Date Added:</label>
                <input
  type="date"
  name="dateAdded"
  value={formData.dateAdded}
  onChange={handleChange}
  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
/>
              </div>

              {/* Supplier/Warranty Period */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Suppuetry Period:</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* Warranty Period */}
              <div>
                <label className="block text-gray-900 font-medium mb-2">Warranty Period:</label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* Discount/Offer Price - Only on desktop, moves below on mobile */}
              <div className="md:hidden">
                <label className="block text-gray-900 font-medium mb-2">Discount / Offer Price:</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>
            </div>

            {/* Bottom Row - Discount and Save Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-end">
              {/* Discount - Desktop only */}
              <div className="hidden md:block">
                <label className="block text-gray-900 font-medium mb-2">Discount / Offer Price:</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full bg-white/60 backdrop-blur-sm text-gray-900 placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/70 border border-gray-300/50"
                />
              </div>

              {/* Save Button */}
              <div className="md:flex md:items-end md:justify-end">
                <button
                  onClick={handleSave}
                  className="w-full md:w-auto md:min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg rounded-xl py-3 md:py-4 px-8 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}