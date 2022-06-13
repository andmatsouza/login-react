import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {servDeleteUser} from '../../service/servDeleteUser';
import api from "../../config/configApi";


export const Users = () => {

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const {state} = useLocation();
  //console.log(state);

  const [data, setData] = useState([]);
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });

  const getUsers = async () => {
    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };    

    await api
      .get("/users", headers)
      .then((response) => {
       // console.log(response);
        setData(response.data.users);
      })
      .catch((err) => {
       // console.log(err.response);
        if (err.response.data.erro) {
          //console.log(err.response.data.mensagem);
          setStatus({
            type: "erro",
            mensagem: err.response.data.mensagem,
          });
        } else {
          setStatus({
            type: "erro",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
  };

  useEffect(() => {
    getUsers();    
  }, []);

  
  const deleteUser = async (idUser) => {

    const response = await servDeleteUser(idUser);    

    if(response){
      setStatus({
        type: response.type,
        mensagem: response.mensagem
      });
      getUsers();
    }else{
      setStatus({
        type: "erro",
        mensagem: "Erro: Tente mais tarde!",
      }); 
    }    
  }
  

  return (
    <>
      <Link to="/dasboard">Dasboard</Link><br />      
      <Link to="/users" reloadDocument>Usuários</Link><br />      
      
      <h1>Listar Usuários</h1>
      <Link to="/add-user"><button type="button">Cadastrar</button></Link><br />
      {status.type === "erro" ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
      {status.type === "success" ? <p style={{color: "green"}}>{status.mensagem}</p> : ""}
      <hr /> 
      {data.map((user) => (
        <div key={user.id}>
          <span>{user.id}</span>
          <br />
          <span>{user.name}</span>
          <br />
          <span>{user.email}</span>
          <br /><br />
          <Link to={"/view-user/" + user.id}><button type="button">Visualizar</button></Link>{" "}
          <Link to={"/edit-user/" + user.id}><button type="button">Editar</button></Link>{" "}
          <Link to={"#" + user.id}><button type="button" onClick={() => deleteUser(user.id)}>Apagar</button></Link>{" "}
          <hr />
        </div>
      ))}
    </>
  );
};
