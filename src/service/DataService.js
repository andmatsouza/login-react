import api from '../config/configApi';

export async function getVeiculosChart(mes, ano) {

  const headers = {
    herders: {
      Authorizaton: "Bearer " + localStorage.getItem("token"),
    },
  };

  const response = await api.get("/veiculo-abast/" + mes + "/" + ano, headers);  
  
  var VeiculoResumo = [];
 
  const veiculos = response.data.totVeiculosAbastecimentos.map( (veiculo, indice) => {    
    return VeiculoResumo[indice] = veiculo.placa;
  })
  return veiculos;
}

export async function getTotalLitrosChart(mes, ano) {

  const headers = {
    herders: {
      Authorizaton: "Bearer " + localStorage.getItem("token"),
    },
  };

  const response = await api.get("/veiculo-abast/" + mes + "/" + ano, headers);  
  
  var LitroResumo = [];
 
  const totLitros = response.data.totVeiculosAbastecimentos.map( (veiculo, indice) => {    
    return LitroResumo[indice] = veiculo.totLitro;
  })
  return totLitros;
}

export async function getTotalValorAbastChart(mes, ano) {

  const headers = {
    herders: {
      Authorizaton: "Bearer " + localStorage.getItem("token"),
    },
  };

  const response = await api.get("/veiculo-abast/" + mes + "/" + ano, headers);  
  
  var ValorAbastResumo = [];
 
  const totValorAbast = response.data.totVeiculosAbastecimentos.map( (veiculo, indice) => {    
    return ValorAbastResumo[indice] = veiculo.totValorAbast;
  })
  return totValorAbast;
}

export async function getTotalOdometroChart(mes, ano) {

  const headers = {
    herders: {
      Authorizaton: "Bearer " + localStorage.getItem("token"),
    },
  };

  const response = await api.get("/veiculo-abast/" + mes + "/" + ano, headers);  
  
  var OdometroResumo = [];
 
  const totOdometro = response.data.totVeiculosAbastecimentos.map( (veiculo, indice) => {    
    return OdometroResumo[indice] = veiculo.totOdometro;
  })
  return totOdometro;
}

