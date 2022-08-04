import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { TopContentAdm } from "../../components/TopContentAdm";
import { TopContentButton } from "../../components/TopContentButton";

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
  
  const [loading, setLoading] = useState(true);

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
      .post("/abastecimento", abastecimento, headers)
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
          .get("/postos/" + page, headers)
          .then((response) => {
            setPosto(response.data.postos);
            setLoading(false);            
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
          .get("/combustiveis", headers)
          .then((response) => {
            setCombustivel(response.data.combustiveis);
            setLoading(false);           
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
    let schema = yup.object({   
     
      data_abastecimento: yup.string("Erro: Necessário preencher o campo data abastecimento!")
        .required("Erro: Necessário preencher o campo data abastecimento!"),
      postoId: yup.string("Erro: Necessário preencher o campo posto abastecimento!")
        .required("Erro: Necessário preencher o campo posto abastecimento!"),
      combustiveiId: yup.string("Erro: Necessário preencher o campo combustível!")
        .required("Erro: Necessário preencher o campo combustível!"),
      qtd_litro: yup.string("Erro: Necessário preencher o campo litro!")
        .required("Erro: Necessário preencher o campo litro!"),           
      valor_litro: yup.string("Erro: Necessário preencher o campo valor litro!")
        .required("Erro: Necessário preencher o campo valor litro!"),
      odometro_km: yup.string("Erro: Necessário preencher o campo KM!")
        .required("Erro: Necessário preencher o campo KM!")      
    });

    try {
      await schema.validate({        
        data_abastecimento: abastecimento.data_abastecimento,
        postoId: abastecimento.postoId,
        combustiveiId: abastecimento.combustiveiId,
        qtd_litro: abastecimento.qtd_litro,
        valor_litro: abastecimento.valor_litro, 
        odometro_km: abastecimento.odometro_km              
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
            <TopContentButton tolink="/veiculos" stilo="btn-info">Listar</TopContentButton>
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
                            {(!loading &&  posto.map((posto) => {
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
                            {(!loading && combustivel.map((combustivel) => {
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
