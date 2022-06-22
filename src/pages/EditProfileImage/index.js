import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { Menu } from "../../components/Menu";
import api from "../../config/configApi";

export const EditProfileImage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [endImg, setEndImg] = useState("");
  // const [endImg, setEndImg] = useState(localStorage.getItem("image"));
   
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
          localStorage.setItem('image', response.data.image);
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
          .get("/view-profile", headers)
          .then((response) => {
            if (response.data.user) {
             setName(response.data.user.name);
              setEmail(response.data.user.email);
              setEndImg(response.data.endImage);
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
      <label>Nome:{name}</label><br />
      <label>E-mail:{email}</label><br /><br />
        <label>Imagem*:</label>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />

        {image ? <img src={URL.createObjectURL(image)} alt="Imagem do usuário" width="150" height="150"/> : <img src={endImg} alt="Imagem do usuário" width="150" height="150" />}<br /><br />
        {/*image ? <img src={URL.createObjectURL(image)} alt="Imagem do usuário" width="150" height="150"/> : <img src={endImg} alt="Imagem do usuário" width="150" height="150" />*/}
        
        * Campo obrigatório <br />
        <br />


        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
