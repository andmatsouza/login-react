import React, { useEffect, useState } from "react";
import api from "../../config/configApi";
import { Link } from "react-router-dom";

export const Users = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
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
      {status.type === "erro" ? <p>{status.mensagem}</p> : ""}
      {data.map((user) => (
        <div key={user.id}>
          <span>{user.id}</span>
          <br />
          <span>{user.name}</span>
          <br />
          <span>{user.email}</span>
          <br />
          <hr />
        </div>
      ))}
    </>
  );
};
