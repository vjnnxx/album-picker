import { useEffect, useState } from "react";

import Card from "./Card/Card";

function App(){

  const [token, setToken] = useState('');

  const [name, setName] = useState('');

  const [album, setAlbum] = useState('');

  const getToken = () =>{
    let params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }

  const getName = async (access_token) => {

    var options = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };

    const response = await fetch('https://api.spotify.com/v1/me/', options);
    const data = await response.json();

    setName(data.display_name);
  }

  const fetchAlbum = async () =>{

    const response = await fetch('/getalbum');
    const data = await response.json();
    setAlbum(data);

    console.log(data)
  }

  useEffect(()=>{
    getToken();
    getName(token);
  },[token]);
  

  return (
    <>
      {token ? (
        <div>
          <h2> Olá, {name}! </h2>
          <button onClick={fetchAlbum}>Escolher</button>

          {album ? (
            <div>
              <Card album={album}/>
            </div>
            
          ): (
            <></>
          )}
          

        </div>
      ) : (
        <a href="/login">Entrar com spotify</a>
      )}
    </>
  )
}

export default App
