import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import api from '../../config/configApi';

export const ViewUser = (props) => {

    const [data, setData] = useState('');
    const [status, setStatus] = useState({
      type: '',
      mensagem: ''
    });
    const {id} = useParams();   

    useEffect(() => {
      const getUser = async () => {
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };    
        await api.get("/user/" + id, headers)
        .then((response) => { 
          if(response.data.user){
            setData(response.data.user);
          }else{
            setStatus({
              type: "erro",
              mensagem: "Erro: Usuário não encontrado!",
            });
          }         
          
        }).catch((err) => {
          if (err.response.data.erro) {            
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
        })
      }
      getUser();
    },[id]);

  return(
    <div>
      <Link to="/dasboard">Dasboard</Link><br />      
      <Link to="/users" reloadDocument>Usuários</Link><br />   
      <h1>Detalhes do Usuário</h1>
      <Link to="/users" reloadDocument>Listar</Link><br />
      {status.type === 'erro' ?
      <Navigate to="/users" state={{
        type: status.type,
        mensagem: status.mensagem
      }} />

     : ""}      
      {status.type === "success" ? <p style={{color: "green"}}>{status.mensagem}</p> : ""}

      <span>{data.id}</span><br />   
      <span>{data.name}</span><br />   
      <span>{data.email}</span><br />   
    </div>
  )
}