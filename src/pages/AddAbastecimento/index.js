import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";
import { TopContentAdmVeiculo } from "../../components/TopContentAdmVeiculo";

import api from "../../config/configApi";

export const AddAbastecimento = () => {
  const { id } = useParams();
  const [abastecimento, setAbastecimento] = useState({    
    data_abastecimento: "",
    qtd_litro: "",
    valor_litro: "",
    odometro_km: "",       
    veiculoId: "",
    postoId: "",   
    combustiveiId: "",   
  });

  const [valorLancTarget, setValorLancTarget] = useState('');

  const [posto, setPosto] = useState("");
  const [combustivel, setCombustivel] = useState("");
  //const [modelos, setModelos] = useState([]);  
  const [page, setPage] = useState("");
  
  const [loadingPosto, setLoadingPosto] = useState(true);
  const [loadingComb, setLoadingComb] = useState(true);

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });  

  const valueInput = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setAbastecimento({ ...abastecimento, [name]: value });                   
  }
  
  const valorAbastecimento = async e => {
    var valorLancamentoInput = e.target.value;    

    valorLancamentoInput = valorLancamentoInput.replace(/\D/g, "");
    valorLancamentoInput = valorLancamentoInput.replace(/(\d)(\d{2})$/, "$1,$2");
    valorLancamentoInput = valorLancamentoInput.replace(/(?=(\d{3})+(\D))\B/g, ".");
   
    setValorLancTarget(valorLancamentoInput);

    var valorSalvar = await valorLancamentoInput.replace(".", "");
    valorSalvar = await valorSalvar.replace(",", ".");

    setAbastecimento({ ...abastecimento, valor_litro: valorSalvar });
}


  const addAbastecimento = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    abastecimento.veiculoId = id;
    await api
      .post("api/abastecimento", abastecimento, headers)
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


      const getPostos = async (page) => {
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
          .get("api/postos/" + page, headers)
          .then((response) => {
            setPosto(response.data.postos);
            setLoadingPosto(false);            
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

      const getCombustiveis = async () => {        
    
        const headers = {
          herders: {
            Authorizaton: "Bearer " + localStorage.getItem("token"),
          },
        };
    
        await api
          .get("api/combustiveis", headers)
          .then((response) => {
            setCombustivel(response.data.combustiveis);
            setLoadingComb(false);           
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
    getPostos();
    getCombustiveis();        
  }, []);  

  async function validate() {
    let schema = yup.object().shape({      

      odometro_km: yup.number().typeError('Digite a valor p odômetro Km').required().positive("O campo deve ser positivo."),      
      valor_litro: yup.number().typeError('Digite o valor do litro').required().positive("O campo deve ser positivo."),
      qtd_litro: yup.number().typeError('O campo Qde Litros deve ser um número').required().positive('O campo qtd litros deve ser positivo').integer("O campo qtd litros deve ser um número inteiro."),
      combustiveiId: yup.number().typeError('Selecione o Combustível').required().positive("O campo deve ser positivo.").integer("O campo deve ser um número inteiro."),
      postoId: yup.number().typeError('Selecione um Posto').required("O campo é obrigatório.").positive("O campo deve ser positivo.").integer("O campo deve ser um número inteiro."),
      data_abastecimento: yup.date().typeError('Digite uma Data Abastecimento válida').required(),

    });

    try {
      await schema.validate({       
         
        odometro_km: abastecimento.odometro_km,
        valor_litro: abastecimento.valor_litro, 
        qtd_litro: abastecimento.qtd_litro,
        combustiveiId: abastecimento.combustiveiId,
        postoId: abastecimento.postoId, 
        data_abastecimento: abastecimento.data_abastecimento,            
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
          <TopContentAdm title="Cadastrar Abastecimentos">
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar Veículos</TopContentButton>
            <TopContentButton tolink={"/view-veiculo/" + id} stilo="btn-info">Visualizar</TopContentButton> 
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
              <form onSubmit={addAbastecimento} className="form-adm">

                <div className="row-input">

                  <div className="column">
                    <label className="title-input">Data Abastecimento</label>
                    <input
                      type="datetime-local"
                      name="data_abastecimento"
                      id="data_abastecimento"
                      className="input-adm"
                      placeholder="Data de abastecimento do veículo"
                      onChange={valueInput}
                    />
                  </div>

                  <div className="column">                        
                        <label className="title-input">Posto:</label>
                        <select name="postoId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingPosto &&  posto.map((posto) => {
                              return (
                                <option value={posto.id} key={posto.id}>{posto.nome_posto}</option>
                              )
                        }) )}
                        </select>
                  </div>

                  <div className="column">                        
                        <label className="title-input">Combustível:</label>
                        <select name="combustiveiId" className="select-adm" onChange={valueInput}>
                          <option value="">Selecione</option>
                            {(!loadingComb && combustivel.map((combustivel) => {
                              return (
                                <option value={combustivel.id} key={combustivel.id}>{combustivel.nome_combustivel}</option>
                              )
                        }))}
                        </select>
                  </div>

                </div>

             <div className="row-input">

                <div className="column">
                    <label className="title-input">Qde Litros</label>
                    <input
                      type="text"
                      name="qtd_litro"
                      id="qtd_litro"
                      className="input-adm"
                      placeholder="Quantidade de litros de combustíveis"
                      onChange={valueInput}
                    />
                </div>

                <div className="column">
                    <label className="title-input">Preço</label>
                    <input
                      type="text"
                      name="valor_litro"
                      id="valor_litro"
                      className="input-adm"
                      placeholder="Preço do combustível"
                      value={valorLancTarget}
                      onChange={valorAbastecimento}
                    />
                </div>

                <div className="column">                        
                        <label className="title-input">Odômetro KM:</label>
                        <input
                      type="text"
                      name="odometro_km"
                      id="odometro_km"
                      className="input-adm"
                      placeholder="KM do carro"
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
