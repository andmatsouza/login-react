import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import api from "../../config/configApi";

export const UpdatePassword = () => {   

  const { key } = useParams();

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  useEffect(() => {

    const valKey = async () => {
      
      await api.get("/val-key-recover-pass/" + key)
      .then((response) => {        
          setStatus({
            type: "success",
            mensagem: response.data.mensagem,
          });        
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
 
  return(
    <div>          
      <h1>Update Password</h1>
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
    </div>
  );
}