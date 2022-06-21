import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as yup from 'yup';

import {Menu} from '../../components/Menu';
import api from "../../config/configApi";

export const EditProfile = () => {
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");  
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });

  const editUser = async (e) => {
    e.preventDefault();

    if (!(await validate())) return;

    const headers = {
      herders: {
        Authorizaton: "Bearer " + localStorage.getItem("token"),
      },
    };

    await api
      .put("/edit-profile", { name, email }, headers)
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
    const getUser = async () => {
      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
      await api
        .get("/view-profile", headers)
        .then((response) => {
          if (response.data.user) {
            setName(response.data.user.name);
            setEmail(response.data.user.email);
          } else {
            setStatus({
              type: "redWarning",
              mensagem: "Erro: Usuário não encontrado!",
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
    getUser();
  }, []);

  /*function validate() {
    if(!name) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo nome!"
    });
    if(!email) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo email!"
    });
    if(!password) return setStatus({type: 'erro', mensagem: "Erro: Necessário preencher o campo senha!"
    });
    if (password < 6) return setStatus({type: 'erro', mensagem: "Erro: A senha precisa ter pelo menos seis caracteres!"
  });

    return true;
  }*/

  async function validate() {
    let schema = yup.object({     
      email: yup.string("Erro: Necessário preencher o campo e-mail!")
      .email("Erro: Necessário preencher o campo e-mail!")
      .required("Erro: Necessário preencher o campo e-mail!"),
      name: yup.string("Erro: Necessário preencher o campo nome!")
      .required("Erro: Necessário preencher o campo nome!")
      
    });
    
  try {
    await schema.validate({name, email });
    return true;
} catch (err) {      
    setStatus({type: 'erro', mensagem: err.errors });
    return false;
}
  }  

  return (
    <div>
      <Menu />
     
      <h1>Editar Perfil</h1>

      <Link to="/view-profile" reloadDocument><button type="button">Perfil</button></Link>{" "}
      

      {status.type === "redWarning" ? (
        <Navigate
          to="/"
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
          to="/view-profile"
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

      <hr />

      <form onSubmit={editUser}>
        <label>Nome*:</label>
        <input
          type="text"
          name="name"
          placeholder="Nome completo do usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />

        <label>E-mail*:</label>
        <input
          type="email"
          name="email"
          placeholder="Melhor e-mail do usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />       

        * Compo obrigatório <br /><br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
