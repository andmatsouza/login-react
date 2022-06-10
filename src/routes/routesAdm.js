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

function CustomRoute({ children }) {
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
          <CustomRoute>
            <Dasboard />
          </CustomRoute>
        }        
      />
      <Route        
        path="/users"
        element={
          <CustomRoute>
            <Users />
          </CustomRoute>
        }        
      />
    </Routes>
  );
}
