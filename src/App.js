import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import QuickStay from "./pages/quickStay/QuickStay";
import ContacUs from "./pages/contact/ContacUs";
import Profile from "./pages/profile/Profile";
import DetailsQuick from "./pages/detailsQuick/DetailsQuick";
import OrderConfirmation from "./components/orderConfirmation/OrderConfirmation";
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess";
import PaymentFailed from "./pages/paymentFailed/PaymentFailed";
import Orders from "./pages/orders/Orders";
import HotelPaymentSuccess from "./pages/paymentSuccess/HotelPaymentSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Policy from "./pages/policy/Policy";

import "react-chatbot-kit/build/main.css";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quickrooms" element={<QuickStay />} />
        <Route path="/quickrooms/:id" element={<DetailsQuick />} />
        <Route path="/orders/:id" element={<Orders />} />
        <Route path="/contact" element={<ContacUs />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/hotel-payment-success/:id"
          element={<HotelPaymentSuccess />}
        />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />
        <Route path="/policy" element={<Policy />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;
