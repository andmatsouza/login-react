import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import * as yup from "yup";

import api from "../../config/configApi";

export const UpdatePassword = () => {
  const { key } = useParams();
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  useEffect(() => {
    const valKey = async () => {
      await api
        .get("api/val-key-recover-pass/" + key)
        .then((response) => {
          /* setStatus({
            type: "success",
            mensagem: response.data.mensagem,
          }); */
        })
        .catch((err) => {
          if (err.response.data.erro) {
            setStatus({
              type: "redDanger",
              mensagem: err.response.data.mensagem,
            });
          } else {
            setStatus({
              type: "redDanger",
              mensagem: "Erro: Tente mais tarde!",
            });
          }
        });
    };

    valKey();
  }, [key]);

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    await api
      .put("api/update-password/" + key, { password })
      .then((response) => {
        setStatus({
          type: "redSuccess",
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
    });

    try {
      await schema.validate({ password });
      return true;
    } catch (err) {
      setStatus({ type: "error", mensagem: err.errors });
      return false;
    }
  }

  return (
    <div className="d-flex">
      <div className="container-login">
        <div className="wrapper-login">
          <div className="title">
            <span>Editar a Senha</span>
          </div>
         
          <form onSubmit={updatePassword} className="form-login">
          {status.type === "redDanger" ? (
            <Navigate
              to="/"
              state={{
                type: "error",
                mensagem: status.mensagem,
              }}
            />
          ) : (
            ""
          )}
          {status.type === "redSuccess" ? (
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
          {status.type === "error" ? (
            <p className="alert-danger">{status.mensagem}</p>
          ) : (
            ""
          )}
          {status.type === "success" ? (
            <p className="alert-success">{status.mensagem}</p>
          ) : (
            ""
          )}
          <div className="row">
          <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Digite a nova senha"
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>           
            <div className="row button">
            <button type="submit" className="button-login">Salvar</button>
            </div>
            <div className="signup-link">
            Lembrou a senha <Link to="/" className="link-pg-login">clique aqui!</Link>
            </div>           
          </form>        
        </div>
      </div>
    </div>
  );
};
