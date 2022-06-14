import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import * as yup from 'yup';

import {Menu} from '../../components/Menu';
import api from "../../config/configApi";
import { servDeleteUser } from "../../service/servDeleteUser";

export const EditUserPassword = () => {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
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
      .put("/user-senha", { id, password }, headers)
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
        .get("/user/" + id, headers)
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
  }, [id]); 

  async function validate() {
    let schema = yup.object({
      password: yup.string("Erro: Necessário preencher o campo senha!")
      .required("Erro: Necessário preencher o campo senha!")
      .min(6,"Erro: A senha deve ter no mínimo 6 caracteres!"),      
    });
    
  try {
    await schema.validate({ password });
    return true;
} catch (err) {      
    setStatus({type: 'erro', mensagem: err.errors });
    return false;
}
  }

  const deleteUser = async (idUser) => {
    const response = await servDeleteUser(idUser);
    if(response){

      if(response.type === "success"){
        setStatus({
          type: 'redSuccess',
          mensagem: response.mensagem
        });
      }else{
        setStatus({
          type: 'erro',
          mensagem: response.mensagem
        })
      }

    }else{
      setStatus({
        type: 'erro',
        mensagem: 'Erro: tente mais tarde!'
      })
    }
  }

  return (
    <div>
     <Menu />
      <h1>Editar Ususário</h1>

      <Link to="/users" reloadDocument><button type="button">Listar</button></Link>{" "}
      <Link to={"/view-user/" + id} reloadDocument><button type="button">Visualizar</button>{" "}
      <Link to={"#"}><button type="button" onClick={() => deleteUser(id)}>Apagar</button> </Link><br />
        
      </Link>
      <br />

      {status.type === "redWarning" ? (
        <Navigate
          to="/users"
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
          to="/users"
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

      <label>Nome:{name}</label><br />
      <label>E-mail:{email}</label><br /><br />
       
        <label>Senha*:</label>
        <input
          type="password"
          name="password"
          placeholder="Senha para acessar o sistema"
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        * Compo obrigatório <br /><br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
