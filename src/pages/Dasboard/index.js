import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

import api from "../../config/configApi";

export const Dasboard = () => { 

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [qtdUsuario, setQtdUsuario] = useState("");
  //const [page, setPage] = useState("");

  
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });

  const getUsers = async (page) => {
    if (page === undefined) {
      page = 1;
    }
    //setPage(page);

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .get("/users/" + page, headers)
      .then((response) => {
        setQtdUsuario(response.data.countUser);        
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
    <div>
      <Navbar />
      <div className="content">
        <Sidebar active="dashboard" />
        <div className="wrapper">
          <div className="row">

          <div className="alert-content-adm">
             {status.type === "danger" ? (<p className="alert-danger">{status.mensagem}</p>) : ("")}
             {status.type === "success" ? (<p className="alert-success">{status.mensagem}</p>) : ("")}
            </div>


            <div className="box box-first">
              <span className=" icon fas fa-users"></span>
              <span>{qtdUsuario}</span>
              <span>Usuários</span>
            </div>

            <div className="box box-second">
              <span className=" icon fas fa-truck-loading"></span>
              <span>43</span>
              <span>Entregas</span>
            </div>

            <div className="box box-third">
              <span className=" icon fas fa-check-circle"></span>
              <span>12</span>
              <span>Completas</span>
            </div>

            <div className="box box-fourth">
              <span className=" icon fas fa-exclamation-triangle"></span>
              <span>3</span>
              <span>Alertas</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
