import React, {useContext} from "react";
import {Context} from '../../Context/AuthContext'; 

import { Link } from "react-router-dom";

export const Menu = () => {

  const { handleLogout } = useContext(Context);

  return(
    <div>
      <Link to="/dasboard" reloadDocument>Dasboard</Link><br />
      <Link to="/users" reloadDocument>Usuários</Link><br />
      <Link to="/view-profile" reloadDocument>Perfil</Link><br />
      <Link to="#" onClick={handleLogout}>Sair</Link><br />      
    </div>
  )
}