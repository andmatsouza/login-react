import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card/indexCardBootstrap";

import api from "../../config/configApi";

const moment = require("moment");

export const Dasboard = () => { 

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [data, setData] = useState([]);
  const [qtdUsuario, setQtdUsuario] = useState("");
  const [qtdVeiculo, setQtdVeiculo] = useState("");
  //const [page, setPage] = useState("");

  
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });

  var dataAtual = moment().format();
  var ano = moment(dataAtual).year();
  var mes = moment(dataAtual).month() + 1;

  const [dataView, setDataView] = useState({
    ano,
    mes,
  });

  const anterior = async () => {
    if (dataView.mes === 1) {
      ano = dataView.ano - 1;
      mes = 12;
      setDataView({
        ano,
        mes,
      });
      getVeiculos(mes, ano);
    } else {
      ano = dataView.ano;
      mes = dataView.mes - 1;
      setDataView({
        ano,
        mes,
      });
      getVeiculos(mes, ano);
    }
  };

  const proximo = async () => {
    if (dataView.mes === 12) {
      ano = dataView.ano + 1;
      mes = 1;
      setDataView({
        ano,
        mes,
      });
      getVeiculos(mes, ano);
    } else {
      ano = dataView.ano;
      mes = dataView.mes + 1;
      setDataView({
        ano,
        mes,
      });
      getVeiculos(mes, ano);
    }
  };

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

  const getVeiculos = async (mes, ano) => {

    if (mes === undefined && ano === undefined) {
      dataAtual = moment().format();
      ano = moment(dataAtual).year();
      mes = moment(dataAtual).month() + 1;
    }
    
    var dt1 = ano;
    var dt2 = mes;
    //setPage(page);
    console.log("Data1 :" + dt1);
    console.log("Data2 :" + dt2);

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .get("/veiculo-abast/" + dt2 + "/" + dt1, headers)
      .then((response) => {
        setData(response.data.totVeiculosAbastecimentos);
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
            <div class="content-adm2">
              <button
                type="button"
                className="btn-info"
                onClick={() => anterior()}
              >
                Anterior
              </button>
              <span>{dataView.mes + "/" + dataView.ano}</span>
              <button
                type="button"
                className="btn-info"
                onClick={() => proximo()}
              >
                Próximo
              </button>
            </div>
          </div>

          <div className="row">

          <div className="alert-content-adm">
             {status.type === "danger" ? (<p className="alert-danger">{status.mensagem}</p>) : ("")}
             {status.type === "success" ? (<p className="alert-success">{status.mensagem}</p>) : ("")}
            </div>
            {data.map((veiculo) => (
              <Card total={veiculo.fabricante + "/" + veiculo.placa}>
              <div class="col">
              <div class="card text-center">
              <div class="card-header">{"Litros: " + veiculo.totLitro}</div>
              <div class="card-header">{"Valor Pago: " + new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(veiculo.totValorAbast)}</div>
              <div class="card-header">{"Total KM: " + veiculo.totOdometro}</div>
              <div class="card-header">{"Custo/Km Média: " + veiculo.totValorAbast/veiculo.totOdometro}</div>
              <div class="card-header">{"Km/L Média: " + veiculo.totOdometro/veiculo.totLitro}</div>
              </div>
              </div>                                                                                
              </Card> 
            ))}           
                       
          </div>

         

        </div>

      </div>
    </div>
  );
};
