import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
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

  const [data, setData] = useState("");
  const [fabricantes, setFabricantes] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
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
        } else {
          //setStatus({
          // type: "redErro",
          // mensagem: "Erro: Veículo não encontrado!",
          //});
          api.get("/veiculo/" + id, headers).then((response) => {
            if (response.data.veiculo !== null) {
              setData(response.data.veiculo);
              //setFabricantes(response.data.veiculo.fabricante);
              //setAbastecimentos(response.data.veiculo.abastecimentos)
              setFabricantes([]);
              setAbastecimentos([]);
              setManutencoes([]);
            }
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

  var odometroInicialMes;
  var odometroTotalMes = 0;
  var qtdLitrosMes = 0;
  var ValorTotalqtdLitrosMes = 0;
  var tam = abastecimentos.length;
  var qtdLitroFinal = 0;
  var valorParcial = 0;
  var valorParcialLitro = 0;
  abastecimentos.map((val, indice) => {
    if (indice === 0) {
      odometroInicialMes = val.odometro_km;
    }
    if (indice === tam - 1) {
      qtdLitroFinal = val.qtd_litro;
    }
    odometroTotalMes = odometroTotalMes + val.odometro_km;
    valorParcial = odometroTotalMes - val.odometro_km;
    qtdLitrosMes = qtdLitrosMes + val.qtd_litro;
    ValorTotalqtdLitrosMes =
    ValorTotalqtdLitrosMes + val.qtd_litro * val.valor_litro;
    valorParcialLitro =
    ValorTotalqtdLitrosMes - val.qtd_litro * val.valor_litro;
  });

  var kmMes = odometroTotalMes - odometroInicialMes;
  var kmRodadoMes = kmMes - valorParcial;
  //var mediaKmMesPorLitro = kmMes / (qtdLitrosMes - qtdLitroFinal);
  var mediaKmMesPorLitro = kmRodadoMes / (qtdLitrosMes - qtdLitroFinal);

  //console.log("Aquiii : " + valorParcial);
  //console.log("Aquiii2 : " + kmRodadoMes);
  //console.log("Aquiii3 : " + valorParcialLitro);
  //console.log("Total Km mês: " + kmMes + " / Total litros mês: " + qtdLitrosMes + " - " + "Km rodado por litro: " + mediaKmMesPorLitro);

  return (
    <div>
      <Navbar />
      <div className="content">
        <Sidebar active="veiculos" />

        <div className="wrapper">
          <div className="row">
            <div className="top-content-adm">
              <span className="title-content">Visualizar Veículo</span>
              <div className="top-content-adm-right">
                <Link to={"/add-manutencao/" + data.id} reloadDocument>
                  <button type="button" className="btn-success">
                    Cadastrar Manutenção
                  </button>
                </Link>{" "}
                <Link to={"/add-abastecimento/" + data.id} reloadDocument>
                  <button type="button" className="btn-success">
                    Cadastrar Abastecimento
                  </button>
                </Link>{" "}
                <Link to="/veiculos" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
              </div>
            </div>

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
            <div class="content-adm">
              <div class="view-det-adm">
                <span class="view-adm-title">Veículo:</span>
                <span class="view-adm-info">{fabricantes.nome_fabricante}</span>
              </div>

              <div class="view-det-adm">
                <span class="view-adm-title">Placa:</span>
                <span class="view-adm-info">{data.placa}</span>
              </div>
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">Custo Total Mês</th>
                  <th className="list-head-content">Total Km Mês</th>
                  <th className="list-head-content">Custo/L Média</th>
                  {/*<th className="list-head-content">Total litros mês</th>*/}
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
                  {/*<td>{qtdLitrosMes}</td>*/}
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

          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
