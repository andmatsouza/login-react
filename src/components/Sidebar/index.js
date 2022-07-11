import React, {useContext} from "react";
import {Context} from '../../Context/AuthContext';

import { Link } from 'react-router-dom';

export const Sidebar = (props) => {
  const { handleLogout } = useContext(Context);  

  return (
    <div id="barsSidebar" className="sidebar">
      <Link to="/dasboard" className={props.active === "dashboard" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className=" icon fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </Link>

      <Link to="/users" className={props.active === "users" ? "sidebar-nav active" : "sidebar-nav"}>
        <i className="icon fas fa-users"></i>
        <span>Usuários</span>
      </Link>      

      <Link to="/view-profile" className={props.active === "profile" ? "sidebar-nav active" : "sidebar-nav"}>
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
