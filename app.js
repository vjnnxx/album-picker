import express from 'express';
import path from 'path';
import crypto from 'crypto';
import querystring from 'querystring';
import { fileURLToPath } from 'url';
import 'dotenv/config'
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
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });

  app.get('/callback', (req, res)=>{
    res.send(req.query);
  });


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, (req, res)=>{
    console.log('Ta funcionando meu chefe');
});