import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import {Menu} from '../../components/Menu';
import { servDeleteUser } from "../../service/servDeleteUser";
import api from "../../config/configApi";

export const ViewUser = (props) => {
  const [data, setData] = useState("");
  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
  });
  const { id } = useParams();
  const [endImg, setEndImg] = useState("");

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
            setEndImg(response.data.endImage);
            setData(response.data.user);
          } else {
            setStatus({
              type: "redErro",
              mensagem: "Erro: Usuário não encontrado!",
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
    getUser();
  }, [id]);

  const deleteUser = async (idUser) => {
    const response = await servDeleteUser(idUser);

    if (response) {
      if (response.type === "success") {
        setStatus({
          type: "redSuccess",
          mensagem: response.mensagem,
        });
      } else {
        setStatus({
          type: response.type,
          mensagem: response.mensagem,
        });
      }
    } else {
      setStatus({
        type: "redErro",
        mensagem: "Erro: Tente mais tarde!",
      });
    }
  };

  return (
    <div>
      <Menu />
      <h1>Detalhes do Usuário</h1>
      <Link to="/users">
        <button type="button">Listar</button>
      </Link>{" "}
      <Link to={"/edit-user/" + data.id}>
        <button type="button">Editar</button>
      </Link>{" "}
      <Link to={"/edit-user-password/" + data.id}>
        <button type="button">Editar Senha</button>
      </Link>{" "}
      <Link to={"/edit-user-image/" + data.id}>
        <button type="button">Editar Imagem</button>
      </Link>{" "}
      <Link to={"#"}>
        <button type="button" onClick={() => deleteUser(data.id)}>
          Apagar
        </button>
      </Link>{" "}
      

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


      {status.type === "redErro" ? (
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


      {status.type === "success" ? (
        <p style={{ color: "green" }}>{status.mensagem}</p>
      ) : (
        ""
      )}
      <hr />
      <span>{data.id}</span>
      <br />
      <span>{<img src={endImg} alt="Imagem do usuário" width="150" height="150" />}</span>
      <br />
      <span>{data.name}</span>
      <br />
      <span>{data.email}</span>
      <br />
    </div>
  );
};
