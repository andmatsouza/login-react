import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";
import { TopContentAdmVeiculo } from "../../components/TopContentAdmVeiculo";

import { servDeleteModelo } from "../../service/servDeleteUser";
import api from "../../config/configApi";
import useDropdownList from "../../hooks/useDropdownList";

import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab } from "react-bootstrap";

const moment = require("moment");

export const ViewVeiculo = (props) => {
  const { actionDropdown, closeDropdownAction } = useDropdownList();
  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const { id } = useParams();

  const [valorParcialLitro, setValorParcialLitro] = useState(0);
  const [kmRodadoMes, setkmRodadoMes] = useState(0);
  const [mediaKmMesPorLitro, setMediaKmMesPorLitro] = useState(0);
  

  const [data, setData] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [trocaOleos, setTrocaOleo] = useState([]);
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
      getVeiculo(mes, ano);
    } else {
      ano = dataView.ano;
      mes = dataView.mes - 1;
      setDataView({
        ano,
        mes,
      });
      getVeiculo(mes, ano);
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
      getVeiculo(mes, ano);
    } else {
      ano = dataView.ano;
      mes = dataView.mes + 1;
      setDataView({
        ano,
        mes,
      });
      getVeiculo(mes, ano);
    }
  };

  const getVeiculo = async (mes, ano) => {
    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    if (mes === undefined && ano === undefined) {
      dataAtual = moment().format();
      ano = moment(dataAtual).year();
      mes = moment(dataAtual).month() + 1;
    }

    await api
      .get("/veiculo/" + id + "/" + mes + "/" + ano, headers)
      .then((response) => {
        if (response.data.veiculo !== null) {
          setData(response.data.veiculo);
          setFabricantes(response.data.veiculo.fabricante);
          setAbastecimentos(response.data.veiculo.abastecimentos);         
          setManutencoes(response.data.veiculo.manutencoes);         
          setTrocaOleo(response.data.veiculo.trocaoleos);
          setValorParcialLitro(response.data.valorParcialLitro);
          setkmRodadoMes(response.data.kmRodadoMes);
          setMediaKmMesPorLitro(response.data.mediaKmMesPorLitro);
        } else {
          setStatus({
           type: "redErro",
           mensagem: "Erro: Veículo não encontrado!",
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

  useEffect(() => {
    getVeiculo();
  }, [id]);

  const deleteVeiculo = async (idveiculo) => {
    const response = await servDeleteModelo(idveiculo);
    if (response) {
      if (response.type === "success") {
        setStatus({
          type: "redSuccess",
          mensagem: response.mensagem,
        });
      } else {
        setStatus({
          type: "erro",
          mensagem: response.mensagem,
        });
      }
    } else {
      setStatus({
        type: "erro",
        mensagem: "Erro: tente mais tarde!",
      });
    }
  };  

  return (
    <div>
      <Navbar />
      <div className="content">
        <Sidebar active="veiculos" />

        <div className="wrapper">
          <div className="row">
          <TopContentAdm title="Visualizar Veículo">
          <TopContentAdmVeiculo veiculo={fabricantes.nome_fabricante} placa={data.placa} />
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar Veículos</TopContentButton>
            <TopContentButton tolink={"/add-trocaoleo/" + data.id} stilo="btn-success">Cadastrar Troca de Óleo</TopContentButton> 
            <TopContentButton tolink={"/add-manutencao/" + data.id} stilo="btn-success">Cadastrar Manutenção</TopContentButton>
            <TopContentButton tolink={"/add-abastecimento/" + data.id} stilo="btn-success">Cadastrar Abastecimento</TopContentButton> 
          </TopContentAdm>

            <div className="alert-content-adm">
              {status.type === "redSuccess" ? (
                <Navigate
                  to="/veiculos"
                  state={{
                    type: "success",
                    mensagem: status.mensagem,
                  }}
                />
              ) : (
                ""
              )}

              {status.type === "redErro" ? (
                <Navigate
                  to="/veiculos"
                  state={{
                    type: "erro",
                    mensagem: status.mensagem,
                  }}
                />
              ) : (
                ""
              )}

              {status.type === "success" ? (
                <p className="alert-success">{status.mensagem}</p>
              ) : (
                ""
              )}
            </div>
          </div>
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
          <Tabs defaultActiveKey="abast" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="abast" title="Abastecimentos">
          <div className="row">
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">Posto</th>
                  <th className="list-head-content">Data Abastecimento</th>
                  <th className="list-head-content">Combustível</th>
                  <th className="list-head-content">Qde Litros</th>
                  <th className="list-head-content">Valor Litro</th>
                  <th className="list-head-content">Odômetro</th>
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {abastecimentos.map((abastecimento, indice) => ( 
                                  
                  <tr key={abastecimento.id}>                   
                    <td className="list-body-content">
                      {abastecimento.posto.nome_posto}
                    </td>
                    <td className="list-body-content">
                      {moment(abastecimento.data_abastecimento).format(
                        "DD/MM/YYYY hh:mm:ss"
                      )}
                    </td>
                    <td className="list-body-content">
                      {abastecimento.combustivei.nome_combustivel}
                    </td>
                    <td className="list-body-content">
                      {abastecimento.qtd_litro}
                    </td>
                    <td className="list-body-content">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(abastecimento.valor_litro)}
                    </td>
                    <td className="list-body-content">
                      {abastecimento.odometro_km}
                    </td>
                    <td className="list-body-content">
                      <div className="dropdown-action">
                        <button
                          onClick={() => {
                            closeDropdownAction();
                            actionDropdown(abastecimento.id);
                          }}
                          className="dropdown-btn-action"
                        >
                          Ações
                        </button>
                        <div
                          id={"actionDropdown" + abastecimento.id}
                          class="dropdown-action-item"
                        >
                          <Link to={"/edit-modelo/" + abastecimento.id}>
                            Editar
                          </Link>
                          <Link
                            to={"#" + abastecimento.id}
                            onClick={() => deleteVeiculo(abastecimento.id)}
                          >
                            Apagar
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))                 
                }
              </tbody>
            </table>
          </div>

          <div className="row">
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">Custo Total Mês</th>
                  <th className="list-head-content">Total Km Mês</th>
                  <th className="list-head-content">Custo/Km Média</th>                  
                  <th className="list-head-content">Km/L Média</th>
                </tr>
              </thead>
              <tbody className="list-body">
                <tr>
                  <td>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorParcialLitro)}
                  </td>
                  <td>{kmRodadoMes}</td>
                  <td>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorParcialLitro / kmRodadoMes)}
                  </td>                  
                  <td>
                    {new Intl.NumberFormat("pt-BR").format(mediaKmMesPorLitro)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </Tab>
          <Tab eventKey="manu" title="Manutenções">


          <div className="row">
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">Oficina</th>
                  <th className="list-head-content">Data Manutenção</th>
                  <th className="list-head-content">Serviço</th>
                  <th className="list-head-content">Descrição da Manutenção</th>
                  <th className="list-head-content">Valor Manutenção</th>                  
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {manutencoes.map((manutencao, indice) => (
                  <tr key={manutencao.id}>
                    <td className="list-body-content">
                      {manutencao.oficina.nome_oficina}
                    </td>
                    <td className="list-body-content">
                      {moment(manutencao.data_mnt).format(
                        "DD/MM/YYYY hh:mm:ss"
                      )}
                    </td>
                    <td className="list-body-content">
                      {manutencao.servico.nome_servico}
                    </td>
                    <td className="list-body-content">
                      {manutencao.desc_mnt}
                    </td>
                    <td className="list-body-content">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(manutencao.valor_mnt)}
                    </td>                   
                    <td className="list-body-content">
                      <div className="dropdown-action">
                        <button
                          onClick={() => {
                            closeDropdownAction();
                            actionDropdown(manutencao.id);
                          }}
                          className="dropdown-btn-action"
                        >
                          Ações
                        </button>
                        <div
                          id={"actionDropdown" + manutencao.id}
                          class="dropdown-action-item"
                        >
                          <Link to={"/edit-modelo/" + manutencao.id}>
                            Editar
                          </Link>
                          <Link
                            to={"#" + manutencao.id}
                            onClick={() => deleteVeiculo(manutencao.id)}
                          >
                            Apagar
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Tab>
          <Tab eventKey="troca" title="Troca de Óleo">


          <div className="row">
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">Oficina</th>
                  <th className="list-head-content">Data Troca Óleo</th>
                  <th className="list-head-content">Tipo Óleo</th>
                  <th className="list-head-content">Km Óleo</th>
                  <th className="list-head-content">Obs</th>
                  <th className="list-head-content">Filtro Óleo</th>
                  <th className="list-head-content">Filtro Combustível</th> 
                  <th className="list-head-content">Valor da Troca</th>  
                  <th className="list-head-content">Km Atual</th>   
                  <th className="list-head-content">Km Próxima Troca</th>             
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
              {trocaOleos.map((trocaOleo, indice) => (
                  <tr key={trocaOleo.id}>
                    <td className="list-body-content">
                      {trocaOleo.oficina.nome_oficina}
                    </td>
                    <td className="list-body-content">
                      {moment(trocaOleo.data_troca).format(
                        "DD/MM/YYYY hh:mm:ss"
                      )}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.oleo.nome_oleo}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.oleo.km_oleo}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.obs}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.filtro_oleo === 1 ? "Sim" : "Não"}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.filtro_combustivel === 1 ? "Sim" : "Não"}
                    </td>
                    <td className="list-body-content">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(trocaOleo.valor_troca)}
                    </td> 
                    <td className="list-body-content">
                      {trocaOleo.odometro_atual}
                    </td>
                    <td className="list-body-content">
                      {trocaOleo.odometro_troca}
                    </td>                    
                                      
                    <td className="list-body-content">
                      <div className="dropdown-action">
                        <button
                          onClick={() => {
                            closeDropdownAction();
                            actionDropdown(trocaOleo.id);
                          }}
                          className="dropdown-btn-action"
                        >
                          Ações
                        </button>
                        <div
                          id={"actionDropdown" + trocaOleo.id}
                          class="dropdown-action-item"
                        >
                          <Link to={"/edit-modelo/" + trocaOleo.id}>
                            Editar
                          </Link>
                          <Link
                            to={"#" + trocaOleo.id}
                            onClick={() => deleteVeiculo(trocaOleo.id)}
                          >
                            Apagar
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </Tab>

          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
