import React, { useEffect, useState } from "react";
import { Link, Navigate,  useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import api from "../../config/configApi";

export const ViewProfile = () => {

   //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
   const {state} = useLocation();
  const [data, setData] = useState("");
  const [endImg, setEndImg] = useState("");
    
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });


  useEffect(() => {
    const getUser = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/view-profile/", headers)
        .then((response) => {
          if (response.data.user) {           
            setEndImg(response.data.endImage);
            setData(response.data.user);
          } else {
            setStatus({
              type: "redErro",
              mensagem: "Erro: Perfil não encontrado!",
            });
          }
        })
        .catch((err) => {
          if (err.response.data.erro) {
            setStatus({
              type: "redErro",
              mensagem: err.response.data.mensagem,
            });
          } else {
            setStatus({
              type: "redErro",
              mensagem: "Erro: Tente mais tarde!",
            });
          }
        });
    };
    getUser();
  }, []);
  

  return (
    <div>
      <Navbar />
      <div class="content">
        <Sidebar active="profile" />    
      <h1>Perfil</h1>
     <Link to="/edit-profile">
        <button type="button">Editar</button>
      </Link>{" "}
       <Link to={"/edit-profile-password"}>
        <button type="button">Editar a Senha</button>
      </Link>{" "}
      <Link to={"/edit-profile-image"}>
        <button type="button">Editar Imagem</button>
      </Link>{" "}

      {status.type === "redErro" ? (
        <Navigate
          to="/"
          state={{
            type: "erro",
            mensagem: status.mensagem,
          }}
        />
      ) : (
        ""
      )}


      {status.type === "success" ? (
        <p style={{ color: "green" }}>{status.mensagem}</p>
      ) : (
        ""
      )}
      <hr />
      <span>{data.id}</span>
      <br />
      <span>{<img src={endImg} alt="Imagem do usuário" width="150" height="150" />}</span>
      <br />
      <span>{data.name}</span>
      <br />
      <span>{data.email}</span>
      <br />
    </div>
    </div>
  );
};
