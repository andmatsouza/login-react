import React, { useContext } from "react";
import {  
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Context } from "../Context/AuthContext";

import { Login } from "../pages/Login";
import { Dasboard } from "../pages/Dasboard";
import { Users } from "../pages/Users";

function PrivateRoute({ children }) {
  const { authenticated } = useContext(Context);
  return authenticated ? children : <Navigate to="/" />;  
}

export default function RoutesAdm() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route        
        path="/dasboard"
        element={
          <PrivateRoute>
            <Dasboard />
          </PrivateRoute>
        }        
      />
      <Route        
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }        
      />
    </Routes>
  );
}
