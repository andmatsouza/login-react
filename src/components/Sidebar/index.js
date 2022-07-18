import React, {useContext} from "react";
import {Context} from '../../Context/AuthContext';

import { Link } from 'react-router-dom';

export const Sidebar = (props) => {
  const { handleLogout } = useContext(Context);  

  return (
    <div id="barsSidebar" className="sidebar">
      <Link to="/dasboard" reloadDocument className={props.active === "dashboard" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className=" icon fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </Link>

      <Link to="/users" reloadDocument className={props.active === "users" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className="icon fa-solid fa-users"></i>
        <span>Usuários</span>
      </Link>

       <Link to="/fabricantes" reloadDocument className={props.active === "fabricantes" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className="icon fa-solid fa-industry"></i>
        <span>Fabricantes</span>
      </Link>       

      <Link to="/view-profile" reloadDocument className={props.active === "profile" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className="icon fas fa-user"></i>
        <span>Perfil</span>
      </Link>     

      <Link to="#" onClick={handleLogout} className="sidebar-nav">
        <i className="icon fas fa-sign-out-alt"></i>
        <span>Sair</span>
  </Link>
    </div>
  );
}; 
