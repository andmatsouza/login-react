import React, { useContext } from "react";
import {  
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Context } from "../Context/AuthContext";

import { Login } from "../pages/Login";
import { AddUserLogin } from "../pages/AddUserLogin";
import { RecoverPassword } from "../pages/RecoverPassword";
import { UpdatePassword } from "../pages/UpdatePassword";

import { Dasboard } from "../pages/Dasboard";
import { Users } from "../pages/Users";
import { AddUser } from "../pages/AddUser";
import { ViewUser } from "../pages/ViewUser";
import { EditUser } from "../pages/EditUser";
import { EditUserPassword } from "../pages/EditUserPassword";
import { EditUserImage } from "../pages/EditUserImage";
import { ViewProfile } from "../pages/ViewProfile";
import { EditProfile } from "../pages/EditProfile";
import { EditProfilePassword } from "../pages/EditProfilePassword";
import { EditProfileImage } from "../pages/EditProfileImage";

import { AddFabricante } from "../pages/AddFabricante";
import { Fabricantes } from "../pages/Fabricantes";
import { EditFabricante } from "../pages/EditFabricante";



function PrivateRoute({ children }) {
  const { authenticated } = useContext(Context);
  return authenticated ? children : <Navigate to="/" />;  
}

export default function RoutesAdm() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/add-user-login" element={<AddUserLogin />} />
      <Route exact path="/recover-password" element={<RecoverPassword />} />
      <Route exact path="/update-password/:key" element={<UpdatePassword />} />
      
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
      <Route
        exact        
        path="/edit-profile-image"
        element={
          <PrivateRoute>
            <EditProfileImage />
          </PrivateRoute>
        }        
      />
       <Route
        exact        
        path="/edit-user-image/:id"
        element={
          <PrivateRoute>
            <EditUserImage />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/fabricantes"
        element={
          <PrivateRoute>
            <Fabricantes />
          </PrivateRoute>
        }        
      />
       <Route
        exact        
        path="/add-fabricante"
        element={
          <PrivateRoute>
            <AddFabricante />
          </PrivateRoute>
        }        
      />
       <Route
        exact        
        path="/edit-fabricante/:id"
        element={
          <PrivateRoute>
            <EditFabricante />
          </PrivateRoute>
        }        
      />
      
    </Routes>
  );
}
