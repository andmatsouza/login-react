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
      <Route        
        path="/add-user"
        element={
          <PrivateRoute>
            <AddUser />
          </PrivateRoute>
        }        
      />
       <Route        
        path="/view-user/:id"
        element={
          <PrivateRoute>
            <ViewUser />
          </PrivateRoute>
        }        
      />
      <Route        
        path="/edit-user/:id"
        element={
          <PrivateRoute>
            <EditUser />
          </PrivateRoute>
        }        
      />
    </Routes>
  );
}
