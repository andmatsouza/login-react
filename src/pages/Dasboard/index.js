import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card";

import api from "../../config/configApi";

export const Dasboard = () => { 

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [qtdUsuario, setQtdUsuario] = useState("");
  const [qtdVeiculo, setQtdVeiculo] = useState("");
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

  const getVeiculos = async (page) => {
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
      .get("/veiculos/" + page, headers)
      .then((response) => {
        setQtdVeiculo(response.data.countVeiculo);
        
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
    getVeiculos();
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

            <Card stilo="box box-first" icon="icon fas fa-users" total={qtdUsuario}> 
              <span>Usuários</span>            
            </Card> 

            <Card stilo="box box-second" icon="icon fa-solid fa-truck" total={qtdVeiculo}> 
              <span>Veículos</span>            
            </Card>

            <Card stilo="box box-third" icon="icon fas fa-check-circle" total="12"> 
              <span>Completas</span>            
            </Card>

            <Card stilo="box box-fourth" icon="icon fas fa-exclamation-triangle" total="3"> 
              <span>Completas</span>            
            </Card>
                       
          </div>

        </div>

      </div>
    </div>
  );
};
