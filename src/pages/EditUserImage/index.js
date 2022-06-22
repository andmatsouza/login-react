import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";


import { Menu } from "../../components/Menu";
import api from "../../config/configApi";

export const EditUserImage = () => {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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

      <label>Nome:{name}</label><br />
      <label>E-mail:{email}</label><br /><br />

        <label>Imagem*:</label>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />
        * Compo obrigatório <br />
        <br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
