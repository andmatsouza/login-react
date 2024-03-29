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
import { ViewFabricante } from "../pages/ViewFabricante";

import { AddModelo } from "../pages/AddModelo";
import { EditModelo } from "../pages/EditModelo";

import { AddVeiculo } from "../pages/AddVeiculo";
import { Veiculos } from "../pages/Veiculos";
import { ViewVeiculo } from "../pages/ViewVeiculo";

import { AddAbastecimento } from "../pages/AddAbastecimento";

import { AddOficina } from "../pages/AddOficina";

import { AddServico } from "../pages/AddServico";

import { AddManutencao } from "../pages/AddManutencao";

import { AddTrocaOleo } from "../pages/AddTrocaOleo";



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
       <Route
        exact        
        path="/view-fabricante/:id"
        element={
          <PrivateRoute>
            <ViewFabricante />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-modelo/:id"
        element={
          <PrivateRoute>
            <AddModelo />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/edit-modelo/:id"
        element={
          <PrivateRoute>
            <EditModelo />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/veiculos"
        element={
          <PrivateRoute>
            <Veiculos />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-veiculo"
        element={
          <PrivateRoute>
            <AddVeiculo />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/view-veiculo/:id"
        element={
          <PrivateRoute>
            <ViewVeiculo />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-abastecimento/:id"
        element={
          <PrivateRoute>
            <AddAbastecimento />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-oficina/:id"
        element={
          <PrivateRoute>
            <AddOficina />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-servico/:id"
        element={
          <PrivateRoute>
            <AddServico />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-manutencao/:id"
        element={
          <PrivateRoute>
            <AddManutencao />
          </PrivateRoute>
        }        
      />
      <Route
        exact        
        path="/add-trocaoleo/:id"
        element={
          <PrivateRoute>
            <AddTrocaOleo />
          </PrivateRoute>
        }        
      />
      
    </Routes>
  );
}
