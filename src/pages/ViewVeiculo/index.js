import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { servDeleteModelo } from "../../service/servDeleteUser";
import api from "../../config/configApi";
import useDropdownList from "../../hooks/useDropdownList";

const moment = require("moment");

export const ViewVeiculo = (props) => {

  const {actionDropdown, closeDropdownAction} = useDropdownList();
  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [data, setData] = useState("");
  const [fabricantes, setFabricantes] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  const { id } = useParams();
 

  useEffect(() => {
    const getVeiculo = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/veiculo/" + id, headers)
        .then((response) => {
          if (response.data.veiculo) {            
            setData(response.data.veiculo);
            setFabricantes(response.data.veiculo.fabricante);
            setAbastecimentos(response.data.veiculo.abastecimentos)
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
            
            <div className="top-content-adm">
              <span className="title-content">Visualizar Veículo</span>
              <div className="top-content-adm-right">
              <Link to={"/add-abastecimento/" + data.id} reloadDocument>
                  <button type="button" className="btn-success">
                    Cadastrar abastecimento
                  </button>
                </Link>{" "}              
                <Link to="/veiculos" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
                {/*<Link to={"/edit-fabricante/" + data.id}>
                  <button type="button" className="btn-warning">
                    Editar
                  </button>
                </Link>{" "}               
                <Link to={"#"}>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => deleteFabricante(data.id)}
                  >
                    Apagar
                  </button>
  </Link>{" "}*/}
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
                {abastecimentos.map((abastecimento) => (
                  <tr key={abastecimento.id}>                                     
                    <td className="list-body-content">{abastecimento.posto.nome_posto}</td>
                    <td className="list-body-content">{moment(abastecimento.data_abastecimento).format("DD/MM/YYYY hh:mm:ss")}</td>
                    <td className="list-body-content">{abastecimento.combustivei.nome_combustivel}</td>
                    <td className="list-body-content">{abastecimento.qtd_litro}</td>
                    <td className="list-body-content">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(abastecimento.valor_litro)}</td>
                    <td className="list-body-content">{abastecimento.odometro_km}</td>
                    <td className="list-body-content">
                    <div className="dropdown-action">
                      <button onClick={() => { closeDropdownAction(); actionDropdown(abastecimento.id) }} className="dropdown-btn-action">Ações</button>
                      <div id={"actionDropdown" + abastecimento.id} class="dropdown-action-item">                      
                      <Link to={"/edit-modelo/" + abastecimento.id}>Editar</Link>                      
                      <Link to={"#" + abastecimento.id} onClick={() => deleteVeiculo(abastecimento.id)}>Apagar</Link>
                      </div>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>          
        </div>       
      </div>
    </div>
  );
};
