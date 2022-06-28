import React, {useContext, useState} from "react";
import {Context} from '../../Context/AuthContext'; 

import { Link } from "react-router-dom";

{/*<Link to="/dasboard" reloadDocument>Dasboard</Link><br />
      <Link to="/users" reloadDocument>Usuários</Link><br />
      <Link to="/view-profile" reloadDocument>Perfil</Link><br />
      <Link to="#" onClick={handleLogout}>Sair</Link><br />*/} 

export const Navbar = () => {

  const [image] = useState(localStorage.getItem('image'));
  const [name] = useState(localStorage.getItem('name'));

  const { handleLogout } = useContext(Context);

  return(    
    
    <nav className="navbar">
      <div className="navbar-content">
        <div className="bars">
          <i className="fas fa-bars"></i>
        </div>
        <img src="/logo_telelimp.png" alt="telelimp" className="logo" />
        
      </div>

      <div className="navbar-content">
        <div className="avatar">
          <img src={image} alt={name} />
          <div className="dropdown-menu setting">
            <div className="item"><span className="fas fa-user"></span> Perfil</div>
            <div className="item">
              <span className="fas fa-cog"></span> Configuração
            </div>
            <div className="item">
              <span className="fas fa-sign-out-alt"></span> Sair
            </div>
          </div>
        </div>
      </div>
    </nav>    
  )
}