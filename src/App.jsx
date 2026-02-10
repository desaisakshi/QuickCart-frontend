
import './App.css'
import { ProductList } from './pages/admin/productlist'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ProductAdd} from "./pages/admin/productadd"
import { Register } from './pages/user/register.jsx';
import { Login } from './pages/user/login.jsx';
import Navbar from './pages/navbar.jsx';
import { CustomerDashboard } from './pages/customer/CustomerDashboard.jsx';
import { CheckerDashboard } from './pages/customer/CheckerDashboard.jsx';
import { ProtectedRoute } from "./hoc/ProtectedRoute.jsx"
import {Unauthorized} from "./pages/Unauthorized.jsx"
import ProductReport from './pages/owner/ProductReport';
import SalesReport from './pages/owner/SalesReport';
import Inventory from './pages/manager/Inventory';
import OrdersToday from './pages/manager/OrdersToday';
import CustomerReport from './pages/customer/customerReport.jsx';
function App() {

  return (
    <>
    <BrowserRouter>
         <Navbar />

      <Routes>
        <Route path="/admin-dashboard"  element={<ProtectedRoute roles={["admin"]}><ProductList /></ProtectedRoute> } />
        <Route path="/" element={<ProtectedRoute ><CustomerDashboard /></ProtectedRoute> } />
        <Route path="/addproduct" element={<ProtectedRoute roles={["admin"]} > <ProductAdd /> </ProtectedRoute >} />
        <Route path="/checker-dashboard"  element={<ProtectedRoute roles={["checker"]}> <CheckerDashboard /> </ProtectedRoute >} />
        <Route path="/register"  element={<Register />} />
        <Route path="/productReport"  element={<ProductReport />} />
        <Route path="/salesReport"  element={<SalesReport />} />
        <Route path="/inventory"  element={<Inventory />} />
        <Route path="/orderstoday"  element={<OrdersToday />} />

        <Route path="/customer-report" element={<CustomerReport />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-dashboard"  element={<ProtectedRoute roles={["customer"]}><CustomerDashboard /></ProtectedRoute >} />
        <Route path="*" element={<Unauthorized />} />

      


      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
