import "./App.css";

import { Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import ChatPage from "./page/ChatPage";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
    </div>
  );
}

export default App;
