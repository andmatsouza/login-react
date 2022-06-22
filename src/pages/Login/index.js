import React, {useState, useContext} from "react";
//substituiu a useHistory
import { Link, useNavigate, useLocation } from "react-router-dom";

import  api from '../../config/configApi';

import { Context } from '../../Context/AuthContext';

export const Login = () => {

  //recebe o state que vem do redirecionamento de outra página, através do componente Navigate.
  const {state} = useLocation();

  const navegate = useNavigate();

  const { signIn } = useContext(Context);  

    const [user, setUser] = useState({
      email: '',
      password: ''
    });    

    const [status, setStatus] = useState({
      type: state ? state.type : "",
      mensagem: state ? state.mensagem : "",
      loading: false,
    })

    const valorInput = e => setUser({...user, [e.target.name]: e.target.value});

    const loginSubmit = async e => {
      e.preventDefault();      

      setStatus({
        loading: true,
      });


      await api.post("/login", user)
            .then((response) => {
                //console.log(response);
                setStatus({
                   /* type: 'success',
                    mensagem: response.data.mensagem,*/
                    loading: false
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.user.name);
                localStorage.setItem('image', response.data.user.image);
                signIn(true);
                return navegate("/dasboard");
            }).catch((err) => {
                if (err.response.data.erro) {
                    //console.log(err.response);
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem,
                        loading: false
                    });
                } else {
                    //console.log("Erro: tente mais tarde");
                    setStatus({
                        type: 'error',
                        mensagem: "Erro: tente mais tarde!",
                        loading: false
                    });
                }
            });    
      
    }

  return (
    <div>
        <h1>Login</h1>
        {status.type === 'error' ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
        {status.type === 'success' ? <p style={{color: "green"}}>{status.mensagem}</p> : ""}
        {/*status.loading ? <p>Validando...</p> : ""*/}
        <form onSubmit={loginSubmit}>
          <label>Usuário: </label>
          <input type="email" name="email" placeholder="Digite o e-mail" onChange={valorInput} /><br /><br />

          <label>Senha: </label>
          <input type="password" name="password" placeholder="Digite a senha" autoComplete="on" onChange={valorInput} /><br /><br />
          
          {status.loading ? <button type="submit" disabled>Acessando...</button> : <button type="submit">Acessar</button>}<br /><br />
        </form>
        <Link to="/add-user-login">Cadastrar</Link>{" - "}
        <Link to="/recover-password">Esqueceu a senha</Link>
    </div>
  );
};