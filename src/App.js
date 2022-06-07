import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { Login } from './pages/Login';

function App() {
  return (
    <div>
      <Router>
        <Routes>
            <Route path='/' element={<Login />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;