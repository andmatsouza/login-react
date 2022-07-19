import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { servDeleteUser } from "../../service/servDeleteUser";
import api from "../../config/configApi";
import useDropdownList from "../../hooks/useDropdownList";

export const ViewFabricante = (props) => {

  const {actionDropdown, closeDropdownAction} = useDropdownList();
  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [data, setData] = useState("");
  const [modelos, setModelos] = useState([]);
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  const { id } = useParams();
 

  useEffect(() => {
    const getFabricante = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/fabricante/" + id, headers)
        .then((response) => {
          if (response.data.fabricante) {            
            setData(response.data.fabricante);
            setModelos(response.data.fabricante.modelos);
          } else {
            setStatus({
              type: "redErro",
              mensagem: "Erro: Fabricante não encontrado!",
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
    getFabricante();
  }, [id]);

  const deleteFabricante = async (idUser) => {
    const response = await servDeleteUser(idUser);

    if (response) {
      if (response.type === "success") {
        setStatus({
          type: "redSuccess",
          mensagem: response.mensagem,
        });
      } else {
        setStatus({
          type: response.type,
          mensagem: response.mensagem,
        });
      }
    } else {
      setStatus({
        type: "redErro",
        mensagem: "Erro: Tente mais tarde!",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="content">
        <Sidebar active="fabricantes" />

        <div className="wrapper">
          <div className="row">
            
            <div className="top-content-adm">
              <span className="title-content">Visualizar Fabricantes</span>
              <div className="top-content-adm-right">
              <Link to={"/add-modelo/" + data.id} reloadDocument>
                  <button type="button" className="btn-success">
                    Cadastrar Modelo
                  </button>
                </Link>{" "}              
                <Link to="/fabricantes" reloadDocument>
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
                  to="/fabricantes"
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
                  to="/fabricantes"
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

             { /*<div class="view-det-adm">
                <span class="view-adm-title">ID:</span>
                <span class="view-adm-info">{data.id}</span>
              </div>*/}

              <div class="view-det-adm">
                <span class="view-adm-title">Fabricante:</span>
                <span class="view-adm-info">{data.nome_fabricante}</span>
              </div>

            </div>
            <table className="table-list">
              <thead className="list-head">
                <tr>
                  
                  <th className="list-head-content">Modelos</th>                 
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {modelos.map((modelo) => (
                  <tr key={modelo.id}>                                     
                    <td className="list-body-content">{modelo.nome_modelo}</td>
                    <td className="list-body-content">
                    <div className="dropdown-action">
                      <button onClick={() => { closeDropdownAction(); actionDropdown(modelo.id) }} className="dropdown-btn-action">Ações</button>
                      <div id={"actionDropdown" + modelo.id} class="dropdown-action-item">
                      {/*<Link to={"/view-fabricante/" + modelo.id}>Visualizar</Link>
                      <Link to={"/add-modelo/" + modelo.id}>Cadastrar Modelo</Link>*/}
                      <Link to={"/edit-fabricante/" + modelo.id}>Editar</Link>                      
                      <Link to={"#" + modelo.id} onClick={() => deleteFabricante(modelo.id)}>Apagar</Link>
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
