import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

import api from "../../config/configApi";

export const EditProfilePassword = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      .put("/edit-profile-password", { password }, headers)
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
        .get("/view-profile", headers)
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
  }, []);

  async function validate() {
    let schema = yup.object({
      password: yup
        .string("Erro: Necessário preencher o campo senha!")
        .required("Erro: Necessário preencher o campo senha!")
        .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
    });

    try {
      await schema.validate({ password });
      return true;
    } catch (err) {
      setStatus({ type: "erro", mensagem: err.errors });
      return false;
    }
  }

  return (
    <div>
      <Navbar />
      <div class="content">
        <Sidebar active="profile" />

        <div className="wrapper">
          <div className="row">
            <TopContentAdm title="Editar Senha do Perfil">
              <TopContentButton tolink="/view-profile" stilo="btn-info">
                Perfil
              </TopContentButton>
            </TopContentAdm>

            {/*<div className="top-content-adm">
              <span className="title-content">Editar Senha do Perfil</span>
              <div className="top-content-adm-right">
                <Link to="/view-profile" reloadDocument>
                  <button type="button" className="btn-info">Perfil</button>
                </Link>{" "}
              </div>
            </div>*/}

            <div className="alert-content-adm">
              {status.type === "redWarning" ? (
                <Navigate
                  to="/"
                  state={{ type: "erro", mensagem: status.mensagem }}
                />
              ) : (
                ""
              )}
              {status.type === "redSuccess" ? (
                <Navigate
                  to="/view-profile"
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
                <label>Nome: {name}</label>
                <br />
                <label>E-mail: {email}</label>
                <br />
                <br />

                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Senha:</label>
                    <input
                      type="password"
                      name="password"
                      className="input-adm"
                      placeholder="Senha para acessar o sistema"
                      autoComplete="on"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" class="btn-success">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
