import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as yup from "yup";
import api from "../../config/configApi";

export const AddUserLogin = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valueInput = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const addUser = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authrization: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .post("api/user", user, headers)
      .then((response) => {
        setStatus({
          type: "success",
          mensagem: response.data.mensagem,
        });
      })
      .catch((err) => {
        if (err.response.data.erro) {
          setStatus({
            type: "error",
            mensagem: err.response.data.mensagem,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro: Tente mais tarde!",
          });
        }
      });
  };

  async function validate() {
    let schema = yup.object({
      password: yup
        .string("Erro: Necessário preencher o campo senha!")
        .required("Erro: Necessário preencher o campo senha!")
        .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
      email: yup
        .string("Erro: Necessário preencher o campo e-mail!")
        .email("Erro: Necessário preencher o campo e-mail!")
        .required("Erro: Necessário preencher o campo e-mail!"),
      name: yup
        .string("Erro: Necessário preencher o campo nome!")
        .required("Erro: Necessário preencher o campo nome!"),
    });

    try {
      await schema.validate({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return true;
    } catch (err) {
      setStatus({
        type: "error",
        mensagem: err.errors,
      });
      return false;
    }
  }

  return (
    <div className="d-flex">
      <div className="container-login">
        <div className="wrapper-login">
          <div className="title">
            <span>Cadastrar Usuário</span>
          </div>
          {status.type === "error" ? (
            <p style={{ color: "#ff0000" }}>{status.mensagem}</p>
          ) : (
            ""
          )}
          {status.type === "success" ? (
            <Navigate
              to="/"
              state={{
                type: "success",
                mensagem: status.mensagem,
              }}
            />
          ) : (
            ""
          )}
          <hr />

          <form onSubmit={addUser} className="form-login">
            <div className="row">
              <label>Nome*</label>
              <input
                type="text"
                name="name"
                placeholder="Nome completo do usuário"
                onChange={valueInput}
              />
            </div>
            <div className="row">
              <label>E-mail*</label>
              <input
                type="email"
                name="email"
                placeholder="Melhor e-mail do usuário"
                onChange={valueInput}
              />
            </div>
            <div className="row">
              <label>Senha*</label>
              <input
                type="password"
                name="password"
                placeholder="Senha para acessar o sistema"
                autoComplete="on"
                onChange={valueInput}
              />
            </div>
            <br /><br />           
            <span>* Campo obrigatório</span>           
            <br /><br />
            <div className="row button">
              <button type="submit" className="button-login">
                Cadastrar
              </button>
            </div>
            <div className="signup-link">
              <Link to="/" className="link-pg-login">
                Acessar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
