import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import api from "../../config/configApi";
import { servDeleteUser } from "../../service/servDeleteUser";

export const EditFabricante = () => {
  const { id } = useParams();

  const [nome_fabricante, setNomeFabricante] = useState("");  
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const editFabricante = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .put("/fabricante", { id, nome_fabricante }, headers)
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
    const getFabricante = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/fabricante/" + id, headers)
        .then((response) => {
          if (response.data.fabricante) {
            setNomeFabricante(response.data.fabricante.nome_fabricante);
            
          } else {
            setStatus({
              type: "redWarning",
              mensagem: "Erro: Fabricante não encontrado!",
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
    getFabricante();
  }, [id]); 

  async function validate() {
    let schema = yup.object({     
      nome_fabricante: yup
        .string("Erro: Necessário preencher o campo nome do fabricante!")
        .required("Erro: Necessário preencher o campo nome do fabricante!"),
    });

    try {
      await schema.validate({ nome_fabricante });
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
        <Sidebar active="fabricantes" />

        <div className="wrapper">
          <div className="row">
            <div className="top-content-adm">
              <span className="title-content">Editar Fabricante</span>
              <div className="top-content-adm-right">
                <Link to="/fabricantes" reloadDocument>
                  <button type="button" className="btn-info">
                    Listar
                  </button>
                </Link>{" "}
                <Link to={"/view-fabricante/" + id} reloadDocument>
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
                  to="/fabricantes"
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
              <form onSubmit={editFabricante}>
                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Nome</label>
                    <input
                      type="text"
                      name="nome_fabricante"
                      className="input-adm"
                      placeholder="Nome do fabricante"
                      value={nome_fabricante}
                      onChange={(e) => setNomeFabricante(e.target.value)}
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
