import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import api from "../../config/configApi";
import { servDeleteModelo } from "../../service/servDeleteUser";

export const EditModelo = () => {
  const { id } = useParams();

  const [nome_modelo, setNomeModelo] = useState("");
  const [fabricanteId, setFabricanteId] = useState("");   
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const editModelo = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .put("/modelo", { id, nome_modelo }, headers)
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
    const getModelo = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/modelo/" + id, headers)
        .then((response) => {
          if (response.data.modelo) {
            setNomeModelo(response.data.modelo.nome_modelo);
            setFabricanteId(response.data.modelo.fabricanteId);            
          } else {
            setStatus({
              type: "redWarning",
              mensagem: "Erro: Modelo não encontrado!",
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
    getModelo();
  }, [id]); 

  async function validate() {
    let schema = yup.object({     
      nome_modelo: yup
        .string("Erro: Necessário preencher o campo nome do modelo1!")
        .required("Erro: Necessário preencher o campo nome do modelo1!"),
    });

    try {
      await schema.validate({ nome_modelo });
      return true;
    } catch (err) {
      setStatus({ type: "erro", mensagem: err.errors });
      return false;
    }
  }

  const deleteModelo = async (idModelo) => {
    const response = await servDeleteModelo(idModelo);
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
        <Sidebar active="fabricantes" />

        <div className="wrapper">
          <div className="row">
            <div className="top-content-adm">
              <span className="title-content">Editar Modelos</span>
              <div className="top-content-adm-right">
                <Link to="/fabricantes" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
                <Link to={"/view-fabricante/" + fabricanteId} reloadDocument>
                  <button type="button" className="btn-info">Visualizar</button>
                </Link>{" "}
                <Link to={"#"}>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => deleteModelo(id)}
                  >Apagar</button>
                </Link>{" "}                
              </div>
            </div>

            <div className="alert-content-adm">
              {status.type === "redWarning" ? (
                <Navigate
                  to="/fabricantes"
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
                  to={"/view-fabricante/" + fabricanteId}
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
              <form onSubmit={editModelo}>
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="nome_modelo"
                      className="input-adm"
                      placeholder="Nome do fabricante"
                      value={nome_modelo}
                      onChange={(e) => setNomeModelo(e.target.value)}
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
