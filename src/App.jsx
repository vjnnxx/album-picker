import { useEffect, useState } from "react";

function App(){

  const [token, setToken] = useState('');

  const getToken = () =>{
    let params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }

  useEffect(()=>{
    getToken();
  },[]);

  return (
    <>
      {token ? (
        <h2> Ta logado pae</h2>
      ) : (
        <a href="/login">Entrar com spotify</a>
      )}
    </>
  )
}

export default App
