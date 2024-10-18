import { useEffect, useState } from "react";
import Card from "./Card/Card";
import './App.css';

function App(){

  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [album, setAlbum] = useState('');
  const [loading, setLoading] = useState(false);

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

    setName('Olá ' + data.display_name + '!');
  }

  const fetchAlbum = async () =>{

    setLoading(true);

    fetch('/getalbum')
    .then(response => response.json())
    .then(data => {
      setAlbum(data)
      setTimeout(()=>null,5000)
    }
    )
    .finally(setLoading(false));
    
  }

  useEffect(()=>{
    getToken();
    getName(token);
  },[token]);
  

  return (
    <div className='main'>
      {token? (
        <div className="content">
          <h1> {name} </h1>

          <p>Não sabe o que ouvir? Clique em escolher e descubra!</p>

          {loading === true ? (
            <div className="spinner"></div>
          ) : (

            album? (
              <>
              <div className="album-content">
                <Card album={album}/>
              </div>
              </>
            ): (
              <></>
            )
          )}
          <button onClick={fetchAlbum} className="sort">Escolher</button>
        </div>
      ) : (
        <a href="/login"> <button className="login">Entrar com Spotify</button> </a>
      )}
    </div>
  )
}

export default App
