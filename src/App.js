import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Login } from "./pages/Login";
import { Dasboard } from "./pages/Dasboard";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/dasboard" element={<Dasboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
