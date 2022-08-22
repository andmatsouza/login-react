import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

import api from "../../config/configApi";

export const AddManutencao = () => {
  const { id } = useParams();
  const [manutencao, setManutencao] = useState({    
    data_mnt: "",   
    valor_mnt: "",
    desc_mnt: "",       
    veiculoId: "",
    oficinaId: "",   
    servicoId: "",   
  });

  const [valorLancTarget, setValorLancTarget] = useState('');

  const [servico, setServico] = useState("");
  const [oficina, setOficina] = useState("");
  //const [modelos, setModelos] = useState([]);  
  const [page, setPage] = useState("");
  
  const [loadingOficina, setLoadingOficina] = useState(true);
  const [loadingServ, setLoadingServ] = useState(true);

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });  

  const valueInput = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setManutencao({ ...manutencao, [name]: value });                   
  }
  
  const valorManutencao = async e => {
    var valorLancamentoInput = e.target.value;    

    valorLancamentoInput = valorLancamentoInput.replace(/\D/g, "");
    valorLancamentoInput = valorLancamentoInput.replace(/(\d)(\d{2})$/, "$1,$2");
    valorLancamentoInput = valorLancamentoInput.replace(/(?=(\d{3})+(\D))\B/g, ".");
   
    setValorLancTarget(valorLancamentoInput);

    var valorSalvar = await valorLancamentoInput.replace(".", "");
    valorSalvar = await valorSalvar.replace(",", ".");

    setManutencao({ ...manutencao, valor_mnt: valorSalvar });
}


  const addManutencao = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    manutencao.veiculoId = id;
    await api
      .post("/manutencao", manutencao, headers)
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
          .get("/oficinas/" + page, headers)
          .then((response) => {
            setOficina(response.data.oficinas);
            setLoadingOficina(false);            
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

      const getServicos = async () => {        
    
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };
    
        await api
          .get("/servicos", headers)
          .then((response) => {
            setServico(response.data.servicos);
            setLoadingServ(false);           
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
    getServicos();        
  }, []);  

  async function validate() {
    let schema = yup.object().shape({  
      
      valor_mnt: yup.number().typeError('Digite o valor da manutenção').required().positive("O campo combustível deve ser positivo.").integer("O campo combustível deve ser um número inteiro."),
      desc_mnt: yup.string("Erro: Necessário preencher o campo descrição da manutenção!").required("Erro: Necessário preencher o campo descrição da manutenção!"),      
      servicoId: yup.number().typeError('Selecione um Posto').required("O campo posto é obrigatório.").positive("O campo posto deve ser positivo.").integer("O campo posto deve ser um número inteiro."),
      oficinaId: yup.number().typeError('Selecione um Posto').required("O campo posto é obrigatório.").positive("O campo posto deve ser positivo.").integer("O campo posto deve ser um número inteiro."),      
      data_mnt: yup.date().typeError('Digite uma Data de Manutenção válida').required(),      

    });

    try {
      await schema.validate({        
       
        valor_mnt: manutencao.valor_mnt, 
        desc_mnt: manutencao.desc_mnt,
        servicoId: manutencao.servicoId,
        oficinaId: manutencao.oficinaId, 
        data_mnt: manutencao.data_mnt,            
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
          <TopContentAdm title="Cadastrar Manutenções">
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar Veículos</TopContentButton>
            <TopContentButton tolink={"/view-veiculo/" + id} stilo="btn-info">Visualizar</TopContentButton> 
            <TopContentButton tolink={"/add-oficina/" + id} stilo="btn-success">Cadastrar Oficina</TopContentButton>
            <TopContentButton tolink={"/add-servico/" + id}  stilo="btn-success">Cadastrar Serviços</TopContentButton>  
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
              <form onSubmit={addManutencao} className="form-adm">

                <div className="row-input">

                  <div className="column">
                    <label className="title-input">Data Manutenção</label>
                    <input
                      type="datetime-local"
                      name="data_mnt"
                      id="data_mnt"
                      className="input-adm"
                      placeholder="Data da manutenção do veículo"
                      onChange={valueInput}
                    />
                  </div>

                  <div className="column">                        
                        <label className="title-input">Oficina:</label>
                        <select name="oficinaId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingOficina &&  oficina.map((oficina) => {
                              return (
                                <option value={oficina.id} key={oficina.id}>{oficina.nome_oficina}</option>
                              )
                        }) )}
                        </select>
                  </div>

                  <div className="column">                        
                        <label className="title-input">Serviço:</label>
                        <select name="servicoId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingServ && servico.map((servico) => {
                              return (
                                <option value={servico.id} key={servico.id}>{servico.nome_servico}</option>
                              )
                        }))}
                        </select>
                  </div>

                </div>

             <div className="row-input">

                <div className="column">
                    <label className="title-input">Descrição da Manutencao</label>
                    <input
                      type="text"
                      name="desc_mnt"
                      id="desc_mnt"
                      className="input-adm"
                      placeholder="Digite a descrição do serviço"
                      onChange={valueInput}
                    />
                </div>

                <div className="column">
                    <label className="title-input">Preço da Manutenção</label>
                    <input
                      type="text"
                      name="valor_mnt"
                      id="valor_mnt"
                      className="input-adm"
                      placeholder="Preço do combustível"
                      value={valorLancTarget}
                      onChange={valorManutencao}
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
