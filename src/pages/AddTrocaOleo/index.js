import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

import api from "../../config/configApi";

export const AddTrocaOleo = () => {
  const { id } = useParams();
  const [trocaOleo, setTrocaOleo] = useState({ 
    valor_troca: "",   
    odometro_atual: "",   
    odometro_troca: "",
    obs: "",   
    filtro_oleo: "",
    filtro_combustivel: "",       
    veiculoId: "",
    oficinaId: "",   
    oleoId: "",   
  });

  const [valorLancTarget, setValorLancTarget] = useState('');

  const [oleo, setOleo] = useState("");
  const [oficina, setOficina] = useState("");
  //const [modelos, setModelos] = useState([]);  
  const [page, setPage] = useState("");
  
  const [loadingOleo, setLoadingOleo] = useState(true);
  const [loadingOficinaOleo, setLoadingOficinaOleo] = useState(true);

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });  

  const valueInput = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setTrocaOleo({ ...trocaOleo, [name]: value });                   
  }
  
  const valorTrocaOleo = async e => {
    var valorLancamentoInput = e.target.value;    

    valorLancamentoInput = valorLancamentoInput.replace(/\D/g, "");
    valorLancamentoInput = valorLancamentoInput.replace(/(\d)(\d{2})$/, "$1,$2");
    valorLancamentoInput = valorLancamentoInput.replace(/(?=(\d{3})+(\D))\B/g, ".");
   
    setValorLancTarget(valorLancamentoInput);

    var valorSalvar = await valorLancamentoInput.replace(".", "");
    valorSalvar = await valorSalvar.replace(",", ".");

    setTrocaOleo({ ...trocaOleo, valor_troca: valorSalvar });
}


  const addTrocaOleo = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    trocaOleo.veiculoId = id;
    trocaOleo.odometro_troca = parseInt(trocaOleo.odometro_atual) + (oleo[0].km_oleo);
    
    await api
      .post("api/trocaoleo", trocaOleo, headers)
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


      const getOficinas = async (page) => {
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
          .get("api/oficinas/" + page, headers)
          .then((response) => {
            setOficina(response.data.oficinas);
            setLoadingOficinaOleo(false);            
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

      const getOleos = async () => {        
    
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };
    
        await api
          .get("api/oleos", headers)
          .then((response) => {
            setOleo(response.data.oleos);
            setLoadingOleo(false);           
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
    getOficinas();
    getOleos();        
  }, []);  

  async function validate() {
    let schema = yup.object().shape({  
      
      valor_troca: yup.number().typeError('Digite o valor da troca de óleoooo').required().positive("O campo troca de óleo deve ser positivo."),
      odometro_atual: yup.number().typeError('Digite o valor da Km atual').required().positive("O campo Km atual deve ser positivo.").integer("O campo Km atual deve ser um número inteiro."),     
      filtro_oleo: yup.number().typeError('Selecione o campo filtro de óleo').required("O campo filtrro de óleo é obrigatório.").positive("O campo filtro de óleo deve ser positivo.").integer("O campo filtro de óleo deve ser um número inteiro."),
      filtro_combustivel: yup.number().typeError('Selecione o campo filtro de combustível').required("O campo filtrro de combustível é obrigatório.").positive("O campo filtro de combustível deve ser positivo.").integer("O campo filtro de combustível deve ser um número inteiro."),     
      oleoId: yup.number().typeError('Selecione um Óleo').required("O campo óleo é obrigatório.").positive("O campo óleo deve ser positivo.").integer("O campo óleo deve ser um número inteiro."),
      oficinaId: yup.number().typeError('Selecione uma oficina').required("O campo oficina é obrigatório.").positive("O campo oficina deve ser positivo.").integer("O campo oficina deve ser um número inteiro."),         
      data_troca: yup.date().typeError('Digite uma Data de Troca válida').required(),  

    });

    try {
      await schema.validate({        
       
        valor_troca: trocaOleo.valor_troca, 
        odometro_atual: trocaOleo.odometro_atual,        
        filtro_oleo: trocaOleo.filtro_oleo, 
        filtro_combustivel: trocaOleo.filtro_combustivel,        
        oleoId: trocaOleo.oleoId,
        oficinaId: trocaOleo.oficinaId,         
        data_troca: trocaOleo.data_troca,
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
          <TopContentAdm title="Cadastrar Troca de Óleo">
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar Veículos</TopContentButton>
            <TopContentButton tolink={"/view-veiculo/" + id} stilo="btn-info">Visualizar</TopContentButton> 
            <TopContentButton tolink={"/add-oficina/" + id} stilo="btn-success">Cadastrar Oficina</TopContentButton>
            <TopContentButton tolink={"/add-oleo/" + id}  stilo="btn-success">Cadastrar Óleo</TopContentButton>  
          </TopContentAdm>


            {/*<div class="top-content-adm">
              <span class="title-content">Cadastrar Abastecimentos</span>
              <div class="top-content-adm-right">
                <Link to="/veiculos" reloadDocument>
                  <button type="button" class="btn-info">
                    Listar
                  </button>
                </Link>
              </div>
  </div>*/}

            <div className="alert-content-adm">
              {status.type === "error" ? (
                <p className="alert-danger">{status.mensagem}</p>
              ) : (
                ""
              )}
              {status.type === "redSuccess" ? (
                <Navigate
                  to={"/view-veiculo/" + id}
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
              <form onSubmit={addTrocaOleo} className="form-adm">

                <div className="row-input">

                  <div className="column">
                    <label className="title-input">Data Troca</label>
                    <input
                      type="datetime-local"
                      name="data_troca"
                      id="data_troca"
                      className="input-adm"
                      placeholder="Data da troca do óleo"
                      onChange={valueInput}
                    />
                  </div>

                  <div className="column">                        
                        <label className="title-input">Oficina:</label>
                        <select name="oficinaId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingOficinaOleo &&  oficina.map((oficina) => {
                              return (
                                <option value={oficina.id} key={oficina.id}>{oficina.nome_oficina}</option>
                              )
                        }) )}
                        </select>
                  </div>

                  <div className="column">                        
                        <label className="title-input">Tipo Óleo:</label>
                        <select name="oleoId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingOleo && oleo.map((oleo) => {
                              return (
                                <option value={oleo.id} key={oleo.id}>{oleo.nome_oleo}</option>
                              )
                        }))}
                        </select>
                  </div>

                </div>

             <div className="row-input">

                <div className="column">
                    <label className="title-input">Filtro Óleo</label>
                    <select name="filtro_oleo" className="select-adm" onChange={valueInput}>
                    <option value="">Selecione</option>
                    <option value="1">Sim</option>
                    <option value="2">Não</option>
                    </select>                   
                </div>

                <div className="column">
                    <label className="title-input">Filtro Combustível</label>
                    <select name="filtro_combustivel" className="select-adm" onChange={valueInput}>
                    <option value="">Selecione</option>
                    <option value="1">Sim</option>
                    <option value="2">Não</option>
                    </select>                   
                </div>

                <div className="column">
                    <label className="title-input">Preço da Troca</label>
                    <input
                      type="text"
                      name="valor_troca"
                      id="valor_troca"
                      className="input-adm"
                      placeholder="Preço da Troca do óleo"
                      value={valorLancTarget}
                      onChange={valorTrocaOleo}
                    />
                </div>
                <div className="column">
                    <label className="title-input">Km Atual</label>
                    <input
                      type="text"
                      name="odometro_atual"
                      id="odometro_atual"
                      className="input-adm"
                      placeholder="Digite a Km do veículo atual"                      
                      onChange={valueInput}
                    />
                </div>
                             
              </div>

              <div className="row-input">

              <div className="column">
                    <label className="title-input">Obs</label>
                    <input
                      type="text"
                      name="obs"
                      id="obs"
                      className="input-adm"
                      placeholder="Digite obs"
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
