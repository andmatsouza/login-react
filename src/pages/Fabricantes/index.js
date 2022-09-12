import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { servDeleteFabricante } from "../../service/servDeleteUser";

import useDropdownList from "../../hooks/useDropdownList";

import api from "../../config/configApi";

export const Fabricantes = () => {

 const {actionDropdown, closeDropdownAction} = useDropdownList();

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();
  //console.log(state);

  const [data, setData] = useState([]);
  const [page, setPage] = useState("");
  const [lastPage, setLastPage] = useState("");

  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });

  const getFabricantes = async (page) => {
    if (page === undefined) {
      page = 1;
    }
    setPage(page);

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .get("api/fabricantes/" + page, headers)
      .then((response) => {
        setData(response.data.fabricantes);
        setLastPage(response.data.lastPage);
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
    getFabricantes();
  }, []);

  const deleteFabricante = async (idFabricante) => {
    const response = await servDeleteFabricante(idFabricante);

    if (response) {
      setStatus({
        type: response.type,
        mensagem: response.mensagem,
      });
      getFabricantes();
    } else {
      setStatus({
        type: "erro",
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
              <span className="title-content">Listar Fabricantes</span>
              <div className="top-content-adm-right">
                <Link to="/add-fabricante">
                  <button type="button" className="btn-success">Cadastrar</button>
                </Link>
              </div>
            </div>

            <div className="alert-content-adm">
             {status.type === "danger" ? (<p className="alert-danger">{status.mensagem}</p>) : ("")}
             {status.type === "success" ? (<p className="alert-success">{status.mensagem}</p>) : ("")}
            </div>

            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">ID</th>
                  <th className="list-head-content">Fabricantes</th>                 
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {data.map((fabricante) => (
                  <tr key={fabricante.id}>
                    <td className="list-body-content">{fabricante.id}</td>                   
                    <td className="list-body-content">{fabricante.nome_fabricante}</td>

                    <td className="list-body-content">
                    <div className="dropdown-action">
                      <button onClick={() => { closeDropdownAction(); actionDropdown(fabricante.id) }} className="dropdown-btn-action">Ações</button>
                      <div id={"actionDropdown" + fabricante.id} class="dropdown-action-item">
                      <Link to={"/view-fabricante/" + fabricante.id}>Visualizar</Link>
                      <Link to={"/edit-fabricante/" + fabricante.id}>Editar</Link>                      
                      <Link to={"#" + fabricante.id} onClick={() => deleteFabricante(fabricante.id)}>Apagar</Link>
                      </div>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="content-pagination">
            <div className="pagination">
              <Link to="#" onClick={() => getFabricantes(1)}><i className="fa-solid fa-angles-left"></i></Link>

              {page !== 1 ? <Link to="#" onClick={() => getFabricantes(page - 1)}>{page -1}</Link> : ""}
             
              
              <Link to="#" className="active">{page}</Link>
              
              {page + 1 <= lastPage ? <Link to="#" onClick={() => getFabricantes(page + 1)}>{page + 1}</Link> : ""}

              <Link to="#" onClick={() => getFabricantes(lastPage)}><i className="fa-solid fa-angles-right"></i></Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
