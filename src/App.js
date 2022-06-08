import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { Login } from './pages/Login';
import { Dasboard } from './pages/Dasboard';

function App() {
  return (
    <div>
      <Router>
        <Routes>
            <Route exact path='/' element={<Login />} />
            <Route path='/dasboard' element={<Dasboard />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;