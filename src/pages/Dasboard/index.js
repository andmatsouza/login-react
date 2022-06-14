import React, {useContext} from "react";

import {Context} from '../../Context/AuthContext';

import { Link } from "react-router-dom";

export const Dasboard = () => {  

 const { authenticated, handleLogout } = useContext(Context);
 console.log("Situação do usuário na página dashboard: " + authenticated);
  return(
    <div>
      <Link to="/dasboard">Dasboard</Link><br />
      <Link to="/users" reloadDocument>Usuários</Link><br />
      <Link to="/view-profile">Perfil</Link><br />
      <h1>Dasboard</h1>
      
      <button type="button" onClick={handleLogout}>Sair</button>
    </div>
  );
}