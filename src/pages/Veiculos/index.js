import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

import { servDeleteVeiculo } from "../../service/servDeleteUser";

import useDropdownList from "../../hooks/useDropdownList";

import api from "../../config/configApi";

export const Veiculos = () => {

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

  const getVeiculos = async (page) => {
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
      .get("api/veiculos/" + page, headers)
      .then((response) => {
        setData(response.data.veiculos);
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
    getVeiculos();
  }, []);

  const deleteVeiculo = async (idVeiculo) => {
    const response = await servDeleteVeiculo(idVeiculo);

    if (response) {
      setStatus({
        type: response.type,
        mensagem: response.mensagem,
      });
      getVeiculos();
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
        <Sidebar active="veiculos" />
        <div className="wrapper">
          <div className="row">

          <TopContentAdm title="Listar Veículos">          
            <TopContentButton tolink="/add-veiculo" stilo="btn-success">Cadastrar Veículo</TopContentButton>
          </TopContentAdm>



            {/*<div className="top-content-adm">
              <span className="title-content">Listar Veículos</span>
              <div className="top-content-adm-right">
                <Link to="/add-veiculo">
                  <button type="button" className="btn-success">Cadastrar</button>
                </Link>
              </div>
  </div>*/}

            <div className="alert-content-adm">
             {status.type === "danger" ? (<p className="alert-danger">{status.mensagem}</p>) : ("")}
             {status.type === "success" ? (<p className="alert-success">{status.mensagem}</p>) : ("")}
            </div>

            <table className="table-list">
              <thead className="list-head">
                <tr>
                  <th className="list-head-content">ID</th>
                  <th className="list-head-content">Placa</th> 
                  <th className="list-head-content">Renavam</th>
                  <th className="list-head-content">Fabricante</th> 
                  <th className="list-head-content">Modelo</th>                                 
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {data.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td className="list-body-content">{veiculo.id}</td>
                    <td className="list-body-content">{veiculo.placa}</td>
                    <td className="list-body-content">{veiculo.renavam}</td>                   
                    <td className="list-body-content">{veiculo.fabricante.nome_fabricante}</td>
                    <td className="list-body-content">{veiculo.modelo.nome_modelo}</td>
                    <td className="list-body-content">
                    <div className="dropdown-action">
                      <button onClick={() => { closeDropdownAction(); actionDropdown(veiculo.id) }} className="dropdown-btn-action">Ações</button>
                      <div id={"actionDropdown" + veiculo.id} class="dropdown-action-item">
                      <Link to={"/view-veiculo/" + veiculo.id}>Visualizar</Link>
                      <Link to={"/edit-veiculo/" + veiculo.id}>Editar</Link>                      
                      <Link to={"#" + veiculo.id} onClick={() => deleteVeiculo(veiculo.id)}>Apagar</Link>
                      </div>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="content-pagination">
            <div className="pagination">
              <Link to="#" onClick={() => getVeiculos(1)}><i className="fa-solid fa-angles-left"></i></Link>

              {page !== 1 ? <Link to="#" onClick={() => getVeiculos(page - 1)}>{page -1}</Link> : ""}
             
              
              <Link to="#" className="active">{page}</Link>
              
              {page + 1 <= lastPage ? <Link to="#" onClick={() => getVeiculos(page + 1)}>{page + 1}</Link> : ""}

              <Link to="#" onClick={() => getVeiculos(lastPage)}><i className="fa-solid fa-angles-right"></i></Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
