import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import api from "../../config/configApi";
import { servDeleteUser } from "../../service/servDeleteUser";

export const EditUser = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const editUser = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .put("api/user", { id, name, email }, headers)
      .then((response) => {
        setStatus({
          type: "redSuccess",
          mensagem: response.data.mensagem,
        });
      })
      .catch((err) => {
        if (err.response.data.erro) {
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
    const getUser = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("api/user/" + id, headers)
        .then((response) => {
          if (response.data.user) {
            setName(response.data.user.name);
            setEmail(response.data.user.email);
          } else {
            setStatus({
              type: "redWarning",
              mensagem: "Erro: Usuário não encontrado!",
            });
          }
        })
        .catch((err) => {
          if (err.response.data.erro) {
            setStatus({
              type: "redWarning",
              mensagem: err.response.data.mensagem,
            });
          } else {
            setStatus({
              type: "redWarning",
              mensagem: "Erro: Tente mais tarde!",
            });
          }
        });
    };
    getUser();
  }, [id]);

  /*function validate() {
    if(!name) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo nome!"
    });
    if(!email) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo email!"
    });
    if(!password) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo senha!"
    });
    if (password < 6) return setStatus({type: 'erro', mensagem: "Erro: A senha precisa ter pelo menos seis caracteres!"
  });

    return true;
  }*/

  async function validate() {
    let schema = yup.object({
      email: yup
        .string("Erro: Necessário preencher o campo e-mail!")
        .email("Erro: Necessário preencher o campo e-mail!")
        .required("Erro: Necessário preencher o campo e-mail!"),
      name: yup
        .string("Erro: Necessário preencher o campo nome!")
        .required("Erro: Necessário preencher o campo nome!"),
    });

    try {
      await schema.validate({ name, email });
      return true;
    } catch (err) {
      setStatus({ type: "erro", mensagem: err.errors });
      return false;
    }
  }

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
      <div class="content">
        <Sidebar active="users" />

        <div className="wrapper">
          <div className="row">
            <div className="top-content-adm">
              <span className="title-content">Editar Ususário</span>
              <div className="top-content-adm-right">
                <Link to="/users" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
                <Link to={"/view-user/" + id} reloadDocument>
                  <button type="button" className="btn-info">Visualizar</button>
                </Link>{" "}
                <Link to={"#"}>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => deleteUser(id)}
                  >Apagar</button>
                </Link>{" "}                
              </div>
            </div>

            <div className="alert-content-adm">
              {status.type === "redWarning" ? (
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
              {status.type === "erro" ? (
                <p style={{ color: "#ff0000" }}>{status.mensagem}</p>
              ) : (
                ""
              )}
            </div>

            <div className="content-adm">
              <form onSubmit={editUser}>
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="name"
                      className="input-adm"
                      placeholder="Nome completo do usuário"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div class="row-input">
                  <div class="column">
                    <label class="title-input">E-mail</label>                    
                    <input
                      type="email"
                      name="email"
                      className="input-adm"
                      placeholder="Melhor e-mail do usuário"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
               
                <button type="submit" class="btn-success">Salvar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
