import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/Card";
import { ChartAbastLitro, ChartAbastValor, ChartOdmetro } from "../../components/Chart";
import {getVeiculosChart, getTotalLitrosChart, getTotalValorAbastChart, getTotalOdometroChart} from '../../service/DataService';

import api from "../../config/configApi";

import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab } from "react-bootstrap";


const moment = require("moment");

export const Dasboard = () => { 

  var totPint =0;
  var totMec =0;
  var totPneu =0;
  var totLav =0;

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [data, setData] = useState([]); 
  const [dataMnt, setDataMnt] = useState([]);  
  const [dataGraficoVeiculo, setDataGraficoVeiculo] = useState([]);
  const [dataGraficoTotLitro, setDataGraficoTotLitro] = useState([]);

  const [dataGraficoTotAbast, setDataGraficoTotAbast] = useState([]);
  const [dataGraficoTotOdometro, setDataGraficoTotOdometro] = useState([]);
  
  const [qtdVeiculo, setQtdVeiculo] = useState("");
  
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
  

  const getVeiculos = async (mes, ano) => {

    if (mes === undefined && ano === undefined) {
      dataAtual = moment().format();
      ano = moment(dataAtual).year();
      mes = moment(dataAtual).month() + 1;
    }   

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .get("api/veiculo-abast/" + mes + "/" + ano, headers)
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

      await api
      .get("api/veiculo-mnt/" + mes + "/" + ano, headers)
      .then((response) => {
        setDataMnt(response.data.totVeiculosManutencoes);                
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
    getVeiculos(dataView.mes,dataView.ano);    
    getVeiculosChart(dataView.mes,dataView.ano)
    .then(data => setDataGraficoVeiculo(data))
    .catch(err => alert(err.response ? err.response.data : err.message));

    getTotalLitrosChart(dataView.mes,dataView.ano)
    .then(data => setDataGraficoTotLitro(data))
    .catch(err => alert(err.response ? err.response.data : err.message));

    getTotalValorAbastChart(dataView.mes,dataView.ano)
    .then(data => setDataGraficoTotAbast(data))
    .catch(err => alert(err.response ? err.response.data : err.message));

    getTotalOdometroChart(dataView.mes,dataView.ano)
    .then(data => setDataGraficoTotOdometro(data))
    .catch(err => alert(err.response ? err.response.data : err.message))

    

    
  }, [dataView.mes,dataView.ano]); 

  
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

          <Tabs defaultActiveKey="abast" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="abast" title="Abastecimentos">

          <div className="row">
         
          <div className="alert-content-adm">
             {status.type === "danger" ? (<p className="alert-danger">{status.mensagem}</p>) : ("")}
             {status.type === "success" ? (<p className="alert-success">{status.mensagem}</p>) : ("")}
            </div>
            
            {data.map((veiculo) => (             
             
              <Card stilo="box box-second" icon="icon fa-solid fa-truck" total={veiculo.fabricante + "/" + veiculo.placa}>

              <div className="div-body">{"Litros: " + veiculo.totLitro}</div>
              <div className="div-body">{"Valor Pago: " + new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(veiculo.totValorAbast)}</div>
              <div className="div-body">{"Total KM: " + veiculo.totOdometro}</div>
              <div className="div-body">{"Custo/Km Média: " + new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL",}).format(veiculo.totValorAbast/veiculo.totOdometro)}</div>
              <div className="div-body">{"Km/L Média: " + veiculo.totOdometro/veiculo.totLitro}</div>                                                                                  
              </Card> 
              
            ))}           
                       
          </div>
         
            <div className="row">
            <div class="content-adm2">
              <ChartAbastLitro dataveiculo={dataGraficoVeiculo} datalitro={dataGraficoTotLitro} />              
              <ChartAbastValor dataveiculo={dataGraficoVeiculo} datalitro={dataGraficoTotAbast}/>
              <ChartOdmetro dataveiculo={dataGraficoVeiculo} datalitro={dataGraficoTotOdometro}/> 
            </div>                 
            </div>
            </Tab>
            <Tab eventKey="manu" title="Manutenções">
            <div className="row">
            <table className="table-list"> 
            <thead className="list-head">
                <tr>
                  <th className="list-head-content">Placa</th>
                  <th className="list-head-content">Lataria e Pintura</th>
                  <th className="list-head-content">Mecânica</th>
                  <th className="list-head-content">Pneus</th>
                  <th className="list-head-content">Lavagem</th>
                  <th className="list-head-content">Total</th>                 
                </tr>
              </thead>
              <tbody className="list-body">                
              {dataMnt.map((veiculo, indice) => {
                
                totPint = totPint + veiculo.valorTotLatariaPintura;
                totMec = totMec + veiculo.valorTotMecanica;
                totPneu = totPneu + veiculo.valorTotPneus;
                totLav = totLav + veiculo.valorTotLavagem;
                
                return(  
                <tr key={veiculo.indice}>
                  <td className="list-body-content">
                      {veiculo.placa + "/" + veiculo.fabricante}
                  </td>
                  <td className="list-body-content">
                      {veiculo.valorTotLatariaPintura}
                  </td>
                  <td className="list-body-content">
                      {veiculo.valorTotMecanica}
                  </td>
                  <td className="list-body-content">
                      {veiculo.valorTotPneus}
                  </td>
                  <td className="list-body-content">
                      {veiculo.valorTotLavagem}
                  </td>
                  <td className="list-body-content">
                      {veiculo.valorTotalMnt}
                  </td>                                                                   
                </tr> 
                                
              )}
              )}  
              </tbody>

              <tfoot>
                 <tr>
                    <td className="list-body-content">total</td> 
                    <td className="list-body-content">{totPint}</td> 
                    <td className="list-body-content">{totMec}</td> 
                    <td className="list-body-content">{totPneu}</td> 
                    <td className="list-body-content">{totLav}</td> 
                    <td className="list-body-content">{totPint+totMec+totPneu+totLav}</td> 
                    <td className="list-body-content"></td>                                 
                 </tr>                
              </tfoot>
            </table>
            </div> 
            </Tab>
            <Tab eventKey="troca" title="Troca de Óleo">
              
            </Tab>
          </Tabs>
        </div>

      </div>
    </div>
  );
};
