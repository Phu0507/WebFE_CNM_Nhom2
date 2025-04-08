import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";
import ForgotPassword from "./page/ForgotPasswordPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
