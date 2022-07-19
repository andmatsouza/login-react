import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

import api from "../../config/configApi";

export const AddFabricante = () => {
  const [fabricante, setFabricante] = useState({
    nome_fabricante: "",
   
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valueInput = (e) =>
    setFabricante({ ...fabricante, [e.target.name]: e.target.value });

  const addFabricante = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await api
      .post("/fabricante", fabricante, headers)
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
     
      nome_fabricante: yup
        .string("Erro: Necessário preencher o campo nome do fabricante!")
        .required("Erro: Necessário preencher o campo nome do fabricante!"),
    });

    try {
      await schema.validate({
        nome_fabricante: fabricante.nome_fabricante,        
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
    <div>
      <Navbar />
      <div class="content">
        <Sidebar active="fabricantes" />

        <div class="wrapper">
          <div class="row">
            <div class="top-content-adm">
              <span class="title-content">Cadastrar Fabricantes</span>
              <div class="top-content-adm-right">
                <Link to="/fabricantes" reloadDocument>
                  <button type="button" class="btn-info">
                    Listar
                  </button>
                </Link>
              </div>
            </div>

            <div className="alert-content-adm">
              {status.type === "error" ? (
                <p className="alert-danger">{status.mensagem}</p>
              ) : (
                ""
              )}
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
            </div>
            <div className="content-adm">
              <form onSubmit={addFabricante} className="form-adm">
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="nome_fabricante"
                      id="nome_fabricante"
                      className="input-adm"
                      placeholder="Nome do fabricante"
                      onChange={valueInput}
                    />
                  </div>
                </div>           

                <button type="submit" class="btn-success">
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
