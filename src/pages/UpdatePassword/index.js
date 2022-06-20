import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import * as yup from 'yup';

import api from "../../config/configApi";

export const UpdatePassword = () => {   

  const { key } = useParams();
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

 useEffect(() => {

    const valKey = async () => {
      
      await api.get("/val-key-recover-pass/" + key)
      .then((response) => {        
         /* setStatus({
            type: "success",
            mensagem: response.data.mensagem,
          }); */       
      })
      .catch((err) => {
        if (err.response.data.erro) {
          setStatus({
            type: "redDanger",
            mensagem: err.response.data.mensagem,
          });
        } else {
          setStatus({
            type: "redDanger",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
    }

    valKey();
  }, [key]);

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;  

   await api
      .put("/update-password/" + key, { password })
      .then((response) => {
        setStatus({
          type: "redSuccess",
          mensagem: response.data.mensagem,
        });
      })
      .catch((err) => {
        if (err.response.data.erro) {
          setStatus({
            type: "error",
            mensagem: err.response.data.mensagem,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
  };

  async function validate() {
    let schema = yup.object({
      password: yup.string("Erro: Necessário preencher o campo senha!")
      .required("Erro: Necessário preencher o campo senha!")
      .min(6,"Erro: A senha deve ter no mínimo 6 caracteres!"),      
    });
    
  try {
    await schema.validate({ password });
    return true;
} catch (err) {      
    setStatus({type: 'error', mensagem: err.errors });
    return false;
}
  } 
 
  return(
    <div>          
      <h1>Editar a Senha</h1>
      {status.type === "redDanger" ? (
        <Navigate
          to="/"
          state={{
            type: "error",
            mensagem: status.mensagem,
          }}
        />
      ) : (
        ""
      )}

{status.type === "redSuccess" ? (
        <Navigate
          to="/"
          state={{
            type: "success",
            mensagem: status.mensagem,
          }}
        />
      ) : (
        ""
      )}

      {status.type === "error" ? (
        <p style={{ color: "#ff0000" }}>{status.mensagem}</p>
      ) : (
        ""
      )}
      {status.type === "success" ? (
        <p style={{ color: "green" }}>{status.mensagem}</p>
      ) : (
        ""
      )} 

      <form onSubmit={updatePassword}>        

        <label>Senha*:</label>
        <input type="password" name="password" placeholder="Senha para acessar o sistema" autoComplete="on" onChange={(e) => setPassword(e.target.value)}/><br /><br />

        * Compo obrigatório <br /><br />

        <button type="submit">Salvar</button><br /><br />        
      </form>  

      Lembrou a senha <Link to="/">clique aqui!</Link>      
    </div>
  );
}