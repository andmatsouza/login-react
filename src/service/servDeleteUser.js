import api from '../config/configApi';

export const servDeleteUser = async (idUser) => {  

  let status = false;

   const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };    


    await api.delete("/user/" + idUser, headers )
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