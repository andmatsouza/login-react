import React, { useEffect, useState } from "react";
import api from "../../config/configApi";
import { Link, useLocation } from "react-router-dom";

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

  
  

  return (
    <>
      <Link to="/dasboard">Dasboard</Link><br />      
      <Link to="/users" reloadDocument>Usuários</Link><br />      
      
      <h1>Listar Usuários</h1>
      <Link to="/add-user">Cadastrar</Link><br /><hr /> 
      {status.type === "erro" ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
      {status.type === "success" ? <p style={{color: "green"}}>{status.mensagem}</p> : ""}
      {data.map((user) => (
        <div key={user.id}>
          <span>{user.id}</span>
          <br />
          <span>{user.name}</span>
          <br />
          <span>{user.email}</span>
          <br />
          <Link to={"/view-user/" + user.id}><button type="button">Visualizar</button></Link><br />
          <hr />
        </div>
      ))}
    </>
  );
};
