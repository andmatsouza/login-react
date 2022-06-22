import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { Menu } from "../../components/Menu";
import api from "../../config/configApi";

export const EditProfileImage = () => {

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
  
      await api
        .put("/edit-profile-image", formData, headers)
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
      <h1>Editar Foto do Perfil</h1>

      <Link to="/view-profile" reloadDocument><button type="button">Perfil</button></Link>{" "}

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
        <label>Imagem*:</label>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />
        * Compo obrigatório <br />
        <br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
