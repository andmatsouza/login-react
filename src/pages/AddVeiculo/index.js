import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

import api from "../../config/configApi";

export const AddVeiculo = () => {
  //const { id } = useParams();
  const [veiculo, setVeiculo] = useState({    
    placa: "",
    renavam: "",
    ano_fabricacao: "",
    status: "",
    fabricanteId: "",   
    modeloId: "",   
  });
  const [data, setData] = useState([]);
  const [fabricante, setFabricante] = useState("");
  const [modelos, setModelos] = useState([]);  
  const [page, setPage] = useState("");

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });  

  const valueInput = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setVeiculo({ ...veiculo, [name]: value });                   
  }

  const valueInputFabricante = (e) => {
  e.preventDefault();
  const { value, name } = e.target;
  setVeiculo({ ...veiculo, [name]: value });
  listarModelos(value);
  }


  const addVeiculo = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //modelo.fabricante_id = id;
    await api
      .post("/veiculo", veiculo, headers)
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


      const getFabricantes = async (page) => {
        if (page === undefined) {
          page = 1;
        }
        setPage(page);
    
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };
    
        await api
          .get("/fabricantes/" + page, headers)
          .then((response) => {
            setData(response.data.fabricantes);            
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

      const listarModelos = async (fabricanteId) => {
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };
        await api
          .get("/fabricante/" + fabricanteId, headers)
          .then((response) => {
            if (response.data.fabricante) {            
              setFabricante(response.data.fabricante);
              setModelos(response.data.fabricante.modelos);
            } else {
              setStatus({
                type: "redErro",
                mensagem: "Erro: Fabricante não encontrado!",
              });
            }
          })
          .catch((err) => {
            if (err.response.data.erro) {
              setStatus({
                type: "redErro",
                mensagem: err.response.data.mensagem,
              });
            } else {
              setStatus({
                type: "redErro",
                mensagem: "Erro: Tente mais tarde!",
              });
            }
          });
      };       

  
  
  useEffect(() => {
    getFabricantes();        
  }, []);  

  async function validate() {
    let schema = yup.object({
     
      placa: yup.string("Erro: Necessário preencher o campo nome da placa!")
        .required("Erro: Necessário preencher o campo nome da placa!"),
      renavam: yup.string("Erro: Necessário preencher o campo renavam!")
        .required("Erro: Necessário preencher o campo renavam!"),
      ano_fabricacao: yup.string("Erro: Necessário preencher o campo ano de fabricação!")
        .required("Erro: Necessário preencher o campo ano de fabricação!"),
      status: yup.string("Erro: Necessário preencher o campo Ativo!")
        .required("Erro: Necessário preencher o campo Ativo!"),           
      fabricanteId: yup.string("Erro: Necessário preencher o campo fabricante!")
        .required("Erro: Necessário preencher o campo fabricante!"),
      modeloId: yup.string("Erro: Necessário preencher o campo modelo!")
        .required("Erro: Necessário preencher o campo modelo!")
    });

    try {
      await schema.validate({
        placa: veiculo.placa,
        renavam: veiculo.renavam,
        ano_fabricacao: veiculo.ano_fabricacao,
        status: veiculo.status,
        fabricanteId: veiculo.fabricanteId,
        modeloId: veiculo.modeloId               
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
            <div class="top-content-adm">
              <span class="title-content">Cadastrar Veículos</span>
              <div class="top-content-adm-right">
                <Link to="/veiculos" reloadDocument>
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
                  to="/veiculos"
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
              <form onSubmit={addVeiculo} className="form-adm">

                <div className="row-input">
                  <div className="column">
                    <label className="title-input">Placa</label>
                    <input
                      type="text"
                      name="placa"
                      id="placa"
                      className="input-adm"
                      placeholder="Número da placa do carro"
                      onChange={valueInput}
                    />
                  </div>
                  <div className="column">
                    <label className="title-input">Renavam</label>
                    <input
                      type="text"
                      name="renavam"
                      id="renavam"
                      className="input-adm"
                      placeholder="Número do renavam do carro"
                      onChange={valueInput}
                    />
                  </div>
                  <div className="column">
                    <label className="title-input">Ativo</label>
                    <select name="status" className="select-adm" onChange={valueInput}>
                    <option value="">Selecione</option>
                    <option value="1">Sim</option>
                    <option value="2">Não</option>
                    </select>                   
                  </div>
                </div>

                <div className="row-input">
                    <div className="column">                        
                        <label className="title-input">Fabricante:</label>
                        <select name="fabricanteId" className="select-adm" onChange={valueInputFabricante}>
                          <option value="">Selecione</option>
                            {data.map((fabricante) => {
                              return (
                                <option value={fabricante.id} key={fabricante.id}>{fabricante.nome_fabricante}</option>
                              )
                        })}
                        </select>
                    </div>
                    <div className="column">                        
                        <label className="title-input">Modelo:</label>
                        <select name="modeloId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {modelos.map((modelo) => {
                              return (
                                <option value={modelo.id} key={modelo.id}>{modelo.nome_modelo}</option>
                              )
                        })}
                        </select>
                    </div>
                    <div className="column">                        
                        <label className="title-input">Ano:</label>
                        <input
                      type="date"
                      name="ano_fabricacao"
                      id="ano_fabricacao"
                      className="input-adm"
                      placeholder="Ano de fabricação do carro"
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
