import api from '../config/configApi';

export const servDeleteUser = async (idUser) => {  

  let status = false;

   const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };    


    await api.delete("api/user/" + idUser, headers )
    .then((response) => {
      status = {
        type: "success",
        mensagem: response.data.mensagem,
      };
    }).catch((err) => {
      if (err.response.data.erro) {        
        status = {
          type: "erro",
          mensagem: err.response.data.mensagem,
        };
      } else {
        status = {
          type: "erro",
          mensagem: "Erro: Tente mais tarde!",
        };
      }
    })

  return status;
}

export const servDeleteFabricante = async (idFabricante) => {  

  let status = false;

   const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api.put("api/fabricante/" + idFabricante, headers )
    .then((response) => {
      status = {
        type: "success",
        mensagem: response.data.mensagem,
      };
    }).catch((err) => {
      if (err.response.data.erro) {        
        status = {
          type: "erro",
          mensagem: err.response.data.mensagem,
        };
      } else {
        status = {
          type: "erro",
          mensagem: "Erro: Tente mais tarde!",
        };
      }
    })

  return status;
}

export const servDeleteVeiculo = async (idVeiculo) => {  

  let status = false;

   const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };
    
    await api.put("api/veiculo/" + idVeiculo, headers )
    .then((response) => {
      status = {
        type: "success",
        mensagem: response.data.mensagem,
      };
    }).catch((err) => {
      if (err.response.data.erro) {        
        status = {
          type: "erro",
          mensagem: err.response.data.mensagem,
        };
      } else {
        status = {
          type: "erro",
          mensagem: "Erro: Tente mais tarde!",
        };
      }
    })

  return status;
}

export const servDeleteModelo = async (idModelo) => {  

  let status = false;

   const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };    


    await api.delete("api/modelo/" + idModelo, headers )
    .then((response) => {
      status = {
        type: "success",
        mensagem: response.data.mensagem,
      };
    }).catch((err) => {
      if (err.response.data.erro) {        
        status = {
          type: "erro",
          mensagem: err.response.data.mensagem,
        };
      } else {
        status = {
          type: "erro",
          mensagem: "Erro: Tente mais tarde!",
        };
      }
    })

  return status;
}