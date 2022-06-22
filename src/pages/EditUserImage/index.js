import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import * as yup from "yup";

import { Menu } from "../../components/Menu";
import api from "../../config/configApi";

export const EditUserImage = () => {
  const { id } = useParams();

    const [image, setImage] = useState('');
    const [status, setStatus] = useState({
      type: "",
      mensagem: "",
    });

    const editUser = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('image', image);

      const headers = {
        herders: {
          Authorizaton: "Bearer " + localStorage.getItem("token"),
        },
      };
  
      await api.put("/edit-user-image/" + id, formData, headers)
        .then((response) => {
          setStatus({
            type: "redSuccess",
            mensagem: response.data.mensagem,
          });
        }).catch((err) => {
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
        })
    }

  return (
    <div>
      <Menu />
      <h1>Editar Foto do Usuário</h1>

      {status.type === "redSuccess" ? (
        <Navigate
          to={"/view-user/" + id}
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

      <form onSubmit={editUser}>
        <label>Imagem*:</label>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />
        * Compo obrigatório <br />
        <br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
