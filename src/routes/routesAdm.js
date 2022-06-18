import React, { useContext } from "react";
import {  
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Context } from "../Context/AuthContext";

import { Login } from "../pages/Login";
import { AddUserLogin } from "../pages/AddUserLogin";
import { Dasboard } from "../pages/Dasboard";
import { Users } from "../pages/Users";
import { AddUser } from "../pages/AddUser";
import { ViewUser } from "../pages/ViewUser";
import { EditUser } from "../pages/EditUser";
import { EditUserPassword } from "../pages/EditUserPassword";
import { ViewProfile } from "../pages/ViewProfile";
import { EditProfile } from "../pages/EditProfile";
import { EditProfilePassword } from "../pages/EditProfilePassword";

function PrivateRoute({ children }) {
  const { authenticated } = useContext(Context);
  return authenticated ? children : <Navigate to="/" />;  
}

export default function RoutesAdm() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/add-user-login" element={<AddUserLogin />} />
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
      <Route
        exact        
        path="/view-profile"
        element={
          <PrivateRoute>
            <ViewProfile />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/edit-profile"
        element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/edit-profile-password"
        element={
          <PrivateRoute>
            <EditProfilePassword />
          </PrivateRoute>
        }        
      />
      
    </Routes>
  );
}
