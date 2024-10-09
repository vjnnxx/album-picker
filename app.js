import express  from 'express';
import path from 'path';
import crypto from 'crypto';
import request  from 'request';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import 'dotenv/config';
const __dirname = path.dirname(fileURLToPath(import.meta.url));



const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/dist'));

const port = 8888;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';


const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}
  
var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });

app.get('/callback', async (req, res)=>{

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        res.cookie('access_token', access_token);
        res.cookie('refresh_token', refresh_token);

        res.redirect('/home');

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/home', async (req, res)=>{

  const access_token = req.cookies.access_token;
    
  var options = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  const response = await fetch('https://api.spotify.com/v1/me/albums?limit=1', options);

  const data = await response.json();

  const total = data.total;
  

  res.cookie('total_album', total);

  // res.sendFile(path.join(__dirname+'/home.html'));
  res.redirect(`/?token=${access_token}`);

  // Servir página html pra logar e mudar a main do react para exibir albums e etc
  //Animação mostrando vários albums etc

});


app.get('/getalbum', async (req, res) =>{

  const access_token = req.cookies.access_token;
  const total = req.cookies.total_album;

  

  const offset = Math.ceil(Math.random() * (total));

  const options = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  const response = await fetch(`https://api.spotify.com/v1/me/albums?offset=${offset}&limit=1`, options);

  const data = await response.json();

  const album = data.items[0].album

  res.status(200).json({"name": album.name, "artists": album.artists, "images": album.images[0].url});
});


app.get('/', (req, res)=>{
    // const token = req.params.token || null;

    // if (token) {
      
    // } else {
    //   console.log('deu bo')
    // }
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(port, (req, res)=>{
    console.log(`Servidor rodando na porta ${port}`);
});