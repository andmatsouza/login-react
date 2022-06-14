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
import { AddUser } from "../pages/AddUser";
import { ViewUser } from "../pages/ViewUser";
import { EditUser } from "../pages/EditUser";
import { EditUserPassword } from "../pages/EditUserPassword";

function PrivateRoute({ children }) {
  const { authenticated } = useContext(Context);
  return authenticated ? children : <Navigate to="/" />;  
}

export default function RoutesAdm() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route
        exact        
        path="/dasboard"
        element={
          <PrivateRoute>
            <Dasboard />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-user"
        element={
          <PrivateRoute>
            <AddUser />
          </PrivateRoute>
        }        
      />
       <Route
        exact        
        path="/view-user/:id"
        element={
          <PrivateRoute>
            <ViewUser />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/edit-user/:id"
        element={
          <PrivateRoute>
            <EditUser />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/edit-user-password/:id"
        element={
          <PrivateRoute>
            <EditUserPassword />
          </PrivateRoute>
        }        
      />
      
    </Routes>
  );
}
