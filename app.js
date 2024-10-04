import express, { response } from 'express';
import path from 'path';
import crypto from 'crypto';
import request  from 'request';
import querystring from 'querystring';
import { fileURLToPath } from 'url';
import 'dotenv/config';
const __dirname = path.dirname(fileURLToPath(import.meta.url));



const app = express();
app.use(express.json());

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

        res.redirect('/' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            code: code,
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
  //res.send(req.query);
});

app.get('/:token', async (req, res)=>{

  const params = querystring.decode(req.params.token);
  
  const access_token = params.access_token;
    
  var options = {
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  const response = await fetch('https://api.spotify.com/v1/me/albums?limit=1', options);

  const data = await response.json();

  const total = data.total;
  const offset = Math.ceil(Math.random() * (total - 50));

  console.log(offset)

  res.send('tudo certo')

  // usar cookies
  //Criar rota para retornar album aleatório

});


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, (req, res)=>{
    console.log('Ta funcionando meu chefe');
});