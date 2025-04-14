import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";
import ForgotPassword from "./page/ForgotPasswordPage";
import OTPPage from "./page/OTPPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import CallRoom from "./page/CallRoom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/room/:roomID" element={<CallRoom />} />
      </Routes>
    </div>
  );
}

export default App;
