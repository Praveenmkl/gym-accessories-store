import React from 'react'
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Products from './pages/Products/Products'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Success from './pages/Success/Success';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer'
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import OrderHistory from './pages/OrderHistory/OrderHistory';

import Toast from './components/Toast/Toast';

const AppLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <Navbar/>
      <Toast />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/success' element={<Success />} />
        <Route path='/myorders' element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      </Routes>

      {!hideFooter && <Footer/>}
    </>
  );
};


const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout />

        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    
   
  )
}

export default App