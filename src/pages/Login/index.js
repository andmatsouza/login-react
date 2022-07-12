import React, { useState, useContext } from "react";
//substituiu a useHistory
import { Link, useNavigate, useLocation } from "react-router-dom";

import api from "../../config/configApi";

import { Context } from "../../Context/AuthContext";

export const Login = () => {
  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const { state } = useLocation();

  const navegate = useNavigate();

  const { signIn } = useContext(Context);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: state ? state.type : "",
    mensagem: state ? state.mensagem : "",
    loading: false,
  });

  const valorInput = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const loginSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
    });

    await api
      .post("/login", user)
      .then((response) => {
        //console.log(response);
        setStatus({
          /* type: 'success',
                    mensagem: response.data.mensagem,*/
          loading: false,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("image", response.data.user.image);
        signIn(true);
        return navegate("/dasboard");        
      })
      .catch((err) => {
        if (err.response.data.erro) {
          //console.log(err.response);
          setStatus({
            type: "error",
            mensagem: err.response.data.mensagem,
            loading: false,
          });
        } else {
          //console.log("Erro: tente mais tarde");
          setStatus({
            type: "error",
            mensagem: "Erro: tente mais tarde!",
            loading: false,
          });
        }
      });
  };

  return (
    <div className="d-flex">
      <div className="container-login">
        <div className="wrapper-login">
          <div className="title">
            <span>Área Restrita</span>
          </div>

         
          <form onSubmit={loginSubmit} className="form-login">
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

             {status.loading ? <p className="alert-success">Validando...</p> : ""}

            <div className="row">
              <i className="fas fa-user"></i>
              <input
                type="email"
                name="email"
                placeholder="Digite o e-mail"
                onChange={valorInput}
              />
            </div>

            <div className="row">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Digite a senha"
                autoComplete="on"
                onChange={valorInput}
              />
            </div>

            <div className="row button">
              {status.loading ? (
                <button type="submit" className="button-login" disabled>
                  Acessando...
                </button>
              ) : (
                <button type="submit" className="button-login">
                  Acessar
                </button>
              )}
            </div>
            <div className="signup-link">
              <Link to="/add-user-login" className="link-pg-login">
                Cadastrar
              </Link>
              {" - "}
              <Link to="/recover-password" className="link-pg-login">
                Esqueceu a senha
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
