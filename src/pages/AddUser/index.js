import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import api from '../../config/configApi';


export const AddUser = () => {

    const [user, setUser] = useState({
      name: '',
      email: '',
      password: ''
    });

    const [status, setStatus] = useState({
      type: '',
      mensagem: ''
    });

    const valueInput = e => setUser({...user, [e.target.name]: e.target.value});

    const addUser = async e => {
      e.preventDefault();
      console.log(user);

      const headers = {
        'headers': {
          'Content-Type': 'application/json',
          'Authrization': 'Bearer ' + localStorage.getItem('token')
        }
      }

      await api.post('/user', user, headers)
      .then((response) => {          
          setStatus({
            type: 'success',
            mensagem: response.data.mensagem 
          });
      }).catch((err) => {
        if (err.response.data.erro) {
          console.log(err.response.data.mensagem);
          setStatus({
            type: 'error',
            mensagem: err.response.data.mensagem 
          });
        }else{          
          setStatus({
            type: 'error',
            mensagem: "Erro: Tente mais tarde!" 
          });
        }
      })
    }

  return(
    <div>
       <Link to="/dasboard">Dasboard</Link><br />      
      <Link to="/users" reloadDocument>Usuários</Link><br />    
      <h1>Cadastrar Usuário</h1>
      <Link to="/users" reloadDocument><button type="button">Listar</button></Link><br /> 
      {status.type === 'error' ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
      {status.type === 'success' ?

      <Navigate to="/users" state={{
        type: "success",
        mensagem: status.mensagem
      }} />

     : ""}
     <hr />
      <form onSubmit={addUser}>
        <label>Nome:</label>
        <input type="text" name="name" placeholder="Nome completo do usuário" onChange={valueInput} /><br /><br />

        <label>E-mail:</label>
        <input type="email" name="email" placeholder="Melhor e-mail do usuário" onChange={valueInput} /><br /><br />

        <label>Senha:</label>
        <input type="password" name="password" placeholder="Senha para acessar o sistema" autoComplete="on" onChange={valueInput} /><br /><br />


        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}