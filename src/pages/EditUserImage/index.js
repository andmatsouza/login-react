import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";


import { Menu } from "../../components/Menu";
import api from "../../config/configApi";
import { servDeleteUser } from "../../service/servDeleteUser";

export const EditUserImage = () => {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [endImg, setEndImg] = useState("");

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
    }, [id]);
    
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
      <h1>Editar Foto do Usuário</h1>
      <Link to="/users" reloadDocument><button type="button">Listar</button></Link>{" "}
      <Link to={"/view-user/" + id} reloadDocument><button type="button">Visualizar</button></Link>{" "}
      <Link to={"#"}><button type="button" onClick={() => deleteUser(id)}>Apagar</button> </Link><br />
        
      
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

      <hr />

      <form onSubmit={editUser}>

      <label>Nome:{name}</label><br />
      <label>E-mail:{email}</label><br /><br />

        <label>Imagem*:</label>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />

        {image ? <img src={URL.createObjectURL(image)} alt="Imagem do usuário" width="150" height="150"/> : <img src={endImg} alt="Imagem do usuário" width="150" height="150" />}

        <br /><br />

        * Campo obrigatório <br />
        <br />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};
