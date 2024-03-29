import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

import api from "../../config/configApi";

export const AddServico = () => {
  const { id } = useParams();
  const [servico, setServico] = useState({
    nome_servico: "",
   
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const valueInput = (e) =>
    setServico({ ...servico, [e.target.name]: e.target.value });

  const addServico = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await api
      .post("api/servico", servico, headers)
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
     
      nome_servico: yup
        .string("Erro: Necessário preencher o campo nome do serviço!")
        .required("Erro: Necessário preencher o campo nome do serviço!"),
    });

    try {
      await schema.validate({
        nome_servico: servico.nome_servico,        
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
        <Sidebar active="veiculos" />

        <div class="wrapper">
          <div class="row">

          <TopContentAdm title="Cadastrar Serviço">
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar</TopContentButton>
          </TopContentAdm>

            <div className="alert-content-adm">
              {status.type === "error" ? (
                <p className="alert-danger">{status.mensagem}</p>
              ) : (
                ""
              )}
              {status.type === "redSuccess" ? (
                <Navigate
                  to={"/add-manutencao/" + id}
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
              <form onSubmit={addServico} className="form-adm">
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="nome_servico"
                      id="nome_servico"
                      className="input-adm"
                      placeholder="Nome do serviço"
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
