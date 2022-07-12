import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as yup from 'yup';

import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

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

      if (!(await validate())) return;
     

      const headers = {
        'headers': {
          'Content-Type': 'application/json'          
        }
      }

      await api.post('/add-user-login', user, headers)
      .then((response) => {          
          setStatus({
            type: 'redSuccess',
            mensagem: response.data.mensagem 
          });
      }).catch((err) => {
        if (err.response.data.erro) {          
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

    /*function validate() {
      if(!user.name) return setStatus({type: 'error', mensagem: "Erro: Necessário preencher o campo nome!"
      });
      if(!user.email) return setStatus({type: 'error', mensagem: "Erro: Necessário preencher o campo email!"
      });
      if(!user.password) return setStatus({type: 'error', mensagem: "Erro: Necessário preencher o campo senha!"
      });
      if (user.password < 6) return setStatus({type: 'error', mensagem: "Erro: A senha precisa ter pelo menos seis caracteres!"
    });

      return true;
    }*/

    async function validate() {
      let schema = yup.object({
        password: yup.string("Erro: Necessário preencher o campo senha!")
        .required("Erro: Necessário preencher o campo senha!")
        .min(6,"Erro: A senha deve ter no mínimo 6 caracteres!"),
        email: yup.string("Erro: Necessário preencher o campo e-mail!")
        .email("Erro: Necessário preencher o campo e-mail!")
        .required("Erro: Necessário preencher o campo e-mail!"),
        name: yup.string("Erro: Necessário preencher o campo nome!")
        .required("Erro: Necessário preencher o campo nome!")
        
      });
      
    try {
      await schema.validate({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return true;
  } catch (err) {      
      setStatus({
        type: 'error',
        mensagem: err.errors 
      });
      return false;
  }
    }

  return(
    <div>
        <Navbar />
      <div class="content">
        <Sidebar active="users" />

        <div class="wrapper">
        <div class="row">
        <div class="top-content-adm">
            <span class="title-content">Cadastrar Usuários</span>
            <div class="top-content-adm-right">
              <button type="button" class="btn-info">Listar</button>
            </div>
          </div>
        </div>
        </div>


      <h1>Cadastrar Usuário</h1>
      <Link to="/users" reloadDocument><button type="button">Listar</button></Link><br /> 
      {status.type === 'error' ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
      {status.type === 'redSuccess' ?

      <Navigate to="/users" state={{
        type: "success",
        mensagem: status.mensagem
      }} />

     : ""}
     <hr />
      <form onSubmit={addUser}>
        <label>Nome*:</label>
        <input type="text" name="name" placeholder="Nome completo do usuário" onChange={valueInput} /><br /><br />

        <label>E-mail*:</label>
        <input type="email" name="email" placeholder="Melhor e-mail do usuário" onChange={valueInput} /><br /><br />

        <label>Senha*:</label>
        <input type="password" name="password" placeholder="Senha para acessar o sistema" autoComplete="on" onChange={valueInput} /><br /><br />

        * Compo obrigatório <br /><br />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
    </div>
  )
}