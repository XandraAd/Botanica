import React, { useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Newest from "./pages/Products/Newest";
import Plants from "./pages/Products/Plants";
import ProductPage from "./pages/Products/ProductPage";
import Footer from "./components/Footer";
import CollectionPage from "./pages/Products/CollectionPage";
import CollectionsPage from "./pages/Products/CollectionsPage";
import CategoryPage from "./pages/Products/CategoryPage";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./pages/Admin/AdminRoute"; 
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductList from "./pages/Admin/ProductList"; 
import AdminAllProducts from "./pages/Admin/AllProducts"; 
import AdminCategoryList from "./pages/Admin/CategoryList"; 
import AdminUserList from "./pages/Admin/UserList"; 
import AdminOrderList from "./pages/Admin/OrderList"; 
import AdminLayout from "./pages/Admin/AdminLayout";
import CollectionList from "./pages/Admin/CollectionList";
import DecorList from "./pages/Admin/DecorList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/Orders/OrderConfirmation";
import { fetchCart } from "./slices/cartSlice";
import { getCurrentUser } from "./slices/authSlice";
import PaymentSuccess from "./pages/Orders/PaymentSuccess";
import OrderDetails from "./pages/Orders/OrderDetails";
import Profile from "./pages/User/UserProfile";

function App() {
  const { userInfo,loading:authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchCart(userInfo._id));
    }
  }, [dispatch, userInfo]);

  if (authLoading) {
    // Render a loader until auth state is ready
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app flex flex-col min-h-screen">
      <Routes>
        {/* ---------- Public Shop Routes ---------- */}
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <header className="sticky top-0 z-50">
                <NavBar />
              </header>
              <main className="flex-grow">
                <Outlet />
              </main>
              <footer className="bg-gray-50 mt-auto">
                <Footer />
              </footer>
            </div>
          }
        >
          <Route index element={<Home />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:collectionId" element={<CollectionPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="new-arrivals" element={<Newest />} />
          <Route path="plants" element={<Plants />} />
       
          <Route path="product-details" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="order/:id" element={<OrderDetails />} />

          {/* Auth */}
          <Route
            path="login"
            element={userInfo ? <Navigate to="/profile" replace /> : <Login />}
          />
          <Route
            path="signup"
            element={userInfo ? <Navigate to="/profile" replace /> : <SignUp />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ---------- Admin Routes ---------- */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route
            path="dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="productlist"
            element={
              <AdminLayout>
                <AdminProductList />
              </AdminLayout>
            }
          />
          <Route
            path="allproductslist"
            element={
              <AdminLayout>
                <AdminAllProducts />
              </AdminLayout>
            }
          />
          <Route
            path="categorylist"
            element={
              <AdminLayout>
                <AdminCategoryList />
              </AdminLayout>
            }
          />
          <Route
            path="userlist"
            element={
              <AdminLayout>
                <AdminUserList />
              </AdminLayout>
            }
          />
          <Route
            path="orderlist"
            element={
              <AdminLayout>
                <AdminOrderList />
              </AdminLayout>
            }
          />
          <Route
            path="products"
            element={
              <AdminLayout>
                <AdminProductList />
              </AdminLayout>
            }
          />
          <Route
            path="collectionlist"
            element={
              <AdminLayout>
                <CollectionList />
              </AdminLayout>
            }
          />
          <Route
            path="decor"
            element={
              <AdminLayout>
                <DecorList />
              </AdminLayout>
            }
          />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
