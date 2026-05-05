import React, { Suspense, lazy } from 'react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import { Route, Routes } from 'react-router-dom';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/Dashboard';
import { ForgotPassword, Login, Register } from './pages/Auth';
import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/cart' element={<Cart />} />
        <Route
          path='/checkout'
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/wishlist'
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route path='/order-success' element={<OrderSuccess />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/forgot-password/*" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path='/blog' element={<Blog />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="grid min-h-screen place-items-center bg-[#020617] text-slate-200">
                  Loading admin...
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
