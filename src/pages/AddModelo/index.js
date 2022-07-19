import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

import api from "../../config/configApi";

export const AddModelo = () => {
  const { id } = useParams();
  const [modelo, setModelo] = useState({
    nome_modelo: "",
    fabricante_id: "",   
  });  

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valueInput = (e) =>
  setModelo({ ...modelo, [e.target.name]: e.target.value });

  const addModelo = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    modelo.fabricante_id = id;
    await api
      .post("/modelo", modelo, headers)
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
     
      nome_modelo: yup
        .string("Erro: Necessário preencher o campo nome do modelo!")
        .required("Erro: Necessário preencher o campo nome do modelo!"),
    });

    try {
      await schema.validate({
        nome_modelo: modelo.nome_modelo,        
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
              <span class="title-content">Cadastrar Modelos</span>
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
              <form onSubmit={addModelo} className="form-adm">
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="nome_modelo"
                      id="nome_modelo"
                      className="input-adm"
                      placeholder="Nome do modelo"
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
