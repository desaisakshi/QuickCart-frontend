import React, { useState,useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProductList } from './action/products';
export const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const respose = await getProductList();
      if(respose.success && respose.products){
        setProducts(respose.products.map((product, index) => ({
          key: product.id || index.toString(),
          name: product.name,
          price: `$${product.price}`,
          description: product.description,
          qrCode: product.qrCode || '� QR'
        })) );
      }
      
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  useEffect(() => {
     fetchProducts();
    return () => {
      
    }
  }, [])
  const reportBtnStyle = {
  background: '#ffffff',
  color: '#4f46e5',
  padding: '10px 16px',
  borderRadius: '8px',
  border: '1px solid #c7d2fe',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const addBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#6366f1',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: '500',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)',
};

  

  

  const handleAddProduct = () => {
    navigate("/addproduct");
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '8px' }}>
                <Package style={{ width: '24px', height: '24px', color: '#6366f1' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Product List</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Manage your product inventory</p>
              </div>
            </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  {/* Reports Buttons */}
  <button
    onClick={() => navigate("/productReport")}
    style={reportBtnStyle}
  >
    Product Report
  </button>

  <button
    onClick={() => navigate("/salesReport")}
    style={reportBtnStyle}
  >
    Sales Report
  </button>

  <button
    onClick={() => navigate("/orderstoday")}
    style={reportBtnStyle}
  >
    Today Orders
  </button>

   <button
      onClick={() => navigate("/customer-report")}
      style={reportBtnStyle}
          >
      Customer Report
      </button>


  {/* Add Product */}
  <button
    onClick={handleAddProduct}
    style={addBtnStyle}
  >
    <Plus style={{ width: '20px', height: '20px' }} />
    Add Product
  </button>
</div>

          </div>
        </div>

        {/* Ant Design Style Table */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ 
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.85)',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    Product Name
                  </th>
                  <th style={{ 
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.85)',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    Price
                  </th>
                  <th style={{ 
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.85)',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    Description
                  </th>
                  <th style={{ 
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(0, 0, 0, 0.85)',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.key}
                    style={{
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ 
                      padding: '16px',
                      fontSize: '14px',
                      color: 'rgba(0, 0, 0, 0.85)',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {product.name}
                    </td>
                    <td style={{ 
                      padding: '16px',
                      fontSize: '14px',
                      color: '#1890ff',
                      fontWeight: '500',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {product.price}
                    </td>
                    <td style={{ 
                      padding: '16px',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '12px',
                        background: '#e6f7ff',
                        color: '#1890ff',
                        borderRadius: '4px',
                        border: '1px solid #91d5ff'
                      }}>
                        {product.description}
                      </span>
                    </td>
                   <td
  style={{
    padding: '16px',
    textAlign: 'center',
    fontSize: '24px',
    borderBottom: '1px solid #f0f0f0'
  }}
>
  <img 
    src={product.qrCode} 
    alt="QR Code"
    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
  />
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div style={{ 
            background: '#fafafa',
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.65)'
          }}>
            Total Products: <span style={{ fontWeight: '600', color: 'rgba(0, 0, 0, 0.85)' }}>{products.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
