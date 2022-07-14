import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate, useLocation } from "react-router-dom";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { servDeleteUser } from "../../service/servDeleteUser";
import api from "../../config/configApi";

export const ViewUser = (props) => {
  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const [data, setData] = useState("");
  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
  });
  const { id } = useParams();
  const [endImg, setEndImg] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/user/" + id, headers)
        .then((response) => {
          if (response.data.user) {
            setEndImg(response.data.endImage);
            setData(response.data.user);
          } else {
            setStatus({
              type: "redErro",
              mensagem: "Erro: Usuário não encontrado!",
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
    getUser();
  }, [id]);

  const deleteUser = async (idUser) => {
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
        <Sidebar active="users" />

        <div className="wrapper">
          <div className="row">
            
            <div className="top-content-adm">
              <span className="title-content">Visualizar Usuário</span>
              <div className="top-content-adm-right">
                <Link to="/users" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
                <Link to={"/edit-user/" + data.id}>
                  <button type="button" className="btn-warning">
                    Editar
                  </button>
                </Link>{" "}
                <Link to={"/edit-user-password/" + data.id}>
                  <button type="button" className="btn-warning">
                    Editar Senha
                  </button>
                </Link>{" "}
                <Link to={"/edit-user-image/" + data.id}>
                  <button type="button" className="btn-warning">
                    Editar Imagem
                  </button>
                </Link>{" "}
                <Link to={"#"}>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => deleteUser(data.id)}
                  >
                    Apagar
                  </button>
                </Link>{" "}
              </div>
            </div>

            <div className="alert-content-adm">
              {status.type === "redSuccess" ? (
                <Navigate
                  to="/users"
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
                  to="/users"
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
                <span class="view-adm-title">Imagem:</span>
                <span class="view-adm-info">{<img src={endImg} alt="Imagem do usuário" width="150" height="150" />}</span>
              </div>

              <div class="view-det-adm">
                <span class="view-adm-title">ID:</span>
                <span class="view-adm-info">{data.id}</span>
              </div>

              <div class="view-det-adm">
                <span class="view-adm-title">Nome:</span>
                <span class="view-adm-info">{data.name}</span>
              </div>

              <div class="view-det-adm">
                <span class="view-adm-title">E-mail:</span>
                <span class="view-adm-info">{data.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
