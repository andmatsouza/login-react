import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { servDeleteUser } from "../../service/servDeleteUser";

import useDropdownList from "../../hooks/useDropdownList";

import api from "../../config/configApi";

export const Users = () => {

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

  const getUsers = async (page) => {
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
      .get("api/users/" + page, headers)
      .then((response) => {
        setData(response.data.users);
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
    getUsers();
  }, []);

  const deleteUser = async (idUser) => {
    const response = await servDeleteUser(idUser);

    if (response) {
      setStatus({
        type: response.type,
        mensagem: response.mensagem,
      });
      getUsers();
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
        <Sidebar active="users" />
        <div className="wrapper">
          <div className="row">
            <div className="top-content-adm">
              <span className="title-content">Listar Usuários</span>
              <div className="top-content-adm-right">
                <Link to="/add-user">
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
                  <th className="list-head-content">Nome</th>
                  <th className="list-head-content table-sm-none">E-mail</th>
                  <th className="list-head-content">Ações</th>
                </tr>
              </thead>
              <tbody className="list-body">
                {data.map((user) => (
                  <tr key={user.id}>
                    <td className="list-body-content">{user.id}</td>                   
                    <td className="list-body-content">{user.name}</td>                    
                    <td className="list-body-content table-sm-none">{user.email}</td>
                    <td className="list-body-content">

                    <div className="dropdown-action">
                    <button onClick={() => { closeDropdownAction(); actionDropdown(user.id) }} className="dropdown-btn-action">Ações</button>
                    <div id={"actionDropdown" + user.id} class="dropdown-action-item">
                      <Link to={"/view-user/" + user.id}>Visualizar</Link>
                      <Link to={"/edit-user/" + user.id}>Editar</Link>
                      <Link to={"#" + user.id} onClick={() => deleteUser(user.id)}>Apagar</Link>
                    </div>
                  </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="content-pagination">
            <div className="pagination">
              <Link to="#" onClick={() => getUsers(1)}><i className="fa-solid fa-angles-left"></i></Link>

              {page !== 1 ? <Link to="#" onClick={() => getUsers(page - 1)}>{page -1}</Link> : ""}
             
              
              <Link to="#" className="active">{page}</Link>
              
              {page + 1 <= lastPage ? <Link to="#" onClick={() => getUsers(page + 1)}>{page + 1}</Link> : ""}

              <Link to="#" onClick={() => getUsers(lastPage)}><i className="fa-solid fa-angles-right"></i></Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
