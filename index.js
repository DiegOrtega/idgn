/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var fs = require("fs");
var SpotifyWebApi = require('spotify-web-api-node');

var nombre, nombre, email, external_urls, seguidores, imagen_url, pais, access_token = null, track_uri, track_uri_ref, num=20, bailongo = 0, energia = 0, fundamental=0, amplitud=0, modo=0, dialogo=0, acustica=0, instrumental=0, audiencia=0, positivismo=0, tempo=0, firma_tiempo=0, duracion=0, bailongo2 = 0, energia2 = 0, fundamental2=0, amplitud2=0, modo2=0, dialogo2=0, acustica2=0, instrumental2=0, audiencia2=0, positivismo2=0, tempo2=0, firma_tiempo2=0, duracion2=0, followers, anti_playlist = [];

var fileName = "./secret-config.json";
var config;

try {
  config = require(fileName);
}
catch (err) {
  config = {}
  console.log("unable to read file '" + fileName + "': ", err);
  console.log("see secret-config-sample.json for an example");
};

console.log("session secret is:", config.sessionSecret);

var app = express();

app.set('port', (process.env.PORT || 5000));

if( app.get('port') == 5000 ){
   
    var client_id = '381fa9402ef049efab1c1a801beef662'; // Your client id
    var client_secret = config.sessionSecret; // Your secret
    var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
    clientId: '381fa9402ef049efab1c1a801beef662',
    clientSecret: config.sessionSecret,
    redirectUri: 'http://localhost:5000/callback' 
}); 
    
}else{
    var client_id = '381fa9402ef049efab1c1a801beef662'; // Your client id
    var client_secret = config.sessionSecret; // Your secret
    var redirect_uri = 'https://idgn.herokuapp.com/callback'; // Your redirect uri

    var spotifyApi = new SpotifyWebApi({
    clientId: '381fa9402ef049efab1c1a801beef662',
    clientSecret: config.sessionSecret,
    redirectUri: 'https://idgn.herokuapp.com/callback' 
});
    
};

console.log("redirect_uri: " + redirect_uri);

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private user-library-read user-top-read';
    
  res.redirect('https://accounts.spotify.com/authorize/?' +
    querystring.stringify({
      client_id: client_id,
      response_type: 'code',
      redirect_uri: redirect_uri,
      scope: scope,
      state: state
    }));
    
    console.log("se termina la autorización desde cliente!");
    
});

app.get('/', function(req, res){
        res.render('pages/autorizacion');        
});

app.get('/callback', function(req, res) {
    
  // your application requests refresh and access tokens
  // after checking the state parameter
    
    console.log("Llegamos al callback!! \n");

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
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
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

            access_token = body.access_token,
            refresh_token = body.refresh_token;
          
          spotifyApi.setAccessToken(access_token);

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
            
            console.log("Datos:");
            console.log(body);
            pais = body.country;
            nombre = body.display_name;
            console.log(body.display_name);
            email = body.email;
            external_urls = body.external_urls;
            seguidores =  body.followers;
            imagen_url =  body.images[0].url;
            followers = body.followers.total;
             
         
        });
          
        var options2 = {
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
 
        request.get(options2, function(error, response, body){
            
            var i = 0;
            
            bailongo = 0, energia = 0, fundamental=0, amplitud=0, modo=0, dialogo=0, acustica=0, instrumental=0, audiencia=0, positivismo=0, tempo=0, firma_tiempo=0, duracion=0, bailongo2 = 0, energia2 = 0, fundamental2=0, amplitud2=0, modo2=0, dialogo2=0, acustica2=0, instrumental2=0, audiencia2=0, positivismo2=0, tempo2=0, firma_tiempo2=0, duracion2=0;
            
            body.items.forEach(function(record){
                
                track_uri = record.uri;
                track_uri = track_uri.substring(14);
                console.log(track_uri);
                
                 spotifyApi.getAudioFeaturesForTrack(track_uri)
                  .then(function(data) {
                    i = i + 1;
                    console.log('i: ' + i);
                     
                     bailongo = bailongo + parseFloat(data.body.danceability);
                     energia = energia + parseFloat(data.body.energy);
                     fundamental = fundamental + parseFloat(data.body.key); 
                     amplitud = amplitud + parseFloat(data.body.loudness);
                     modo = modo + parseFloat(data.body.mode);
                     dialogo = dialogo + parseFloat(data.body.speechiness);
                     acustica = acustica + parseFloat(data.body.acousticness);
                     instrumental = instrumental + parseFloat(data.body.instrumentalness);
                     audiencia = audiencia + parseFloat(data.body.liveness);
                     positivismo = positivismo + parseFloat(data.body.valence);
                     tempo = tempo + parseFloat(data.body.tempo);
                     firma_tiempo = firma_tiempo + parseFloat(data.body.time_signature);
                     duracion = duracion + parseFloat(data.body.duration_ms);
                     
                     if(i == 1){
                         track_uri_ref = track_uri;
                     }
                     
                    if(i == num){
                        bailongo = (bailongo/num)*100;
                        energia = (energia/num)*100; 
                        fundamental = fundamental/num;
                        amplitud = amplitud/num;
                        modo = modo/num;
                        dialogo = (dialogo/num)*100;
                        acustica = (acustica/num)*100;
                        positivismo = (positivismo/num)*100;
                        instrumental = (instrumental/num)*100;
                        audiencia = (audiencia/num)*100;
                        tempo = tempo/num;
                        firma_tiempo = firma_tiempo/num;
                        duracion = duracion/num;
                        
                        console.log('bailongo: ' + bailongo);
                        console.log('energia: ' + energia);
                        console.log('fundamental: ' + fundamental);
                        console.log('amplitud: ' + amplitud);
                        console.log('modo: ' + modo);
                        console.log('dialogo: ' + dialogo);
                        console.log('acustica: ' + acustica);
                        console.log('instrumental: ' + instrumental);
                        console.log('audiencia: ' + audiencia);
                        console.log('positivismo: ' + positivismo);
                        console.log('tempo: ' + tempo);
                        console.log('firma_tiempo:' + firma_tiempo);
                        console.log('duracion: ' + duracion);
                        
                        acustica2 = Math.abs(acustica-50);
                        bailongo2 = Math.abs(bailongo-50);
                        energia2 = Math.abs(energia-50);
                        dialogo2 = Math.abs(dialogo-50);
                        positivismo2 = Math.abs(positivismo-50);
                        instrumental2 = Math.abs(instrumental-50);
                        audiencia2 = Math.abs(audiencia-50);
                        fundamental2 = Math.round(fundamental);
                        duracion2 = Math.round(duracion);
                        modo2 = Math.round(modo);
                        firma_tiempo2 = Math.round(firma_tiempo);
                        
                        var options3 = {
                          url: 'https://api.spotify.com/v1/recommendations?'+'seed_tracks=' + 
                          track_uri_ref + '&target_acousticness='+ acustica2 + '&target_danceability=' + 
                          bailongo2 + '&target_energy=' + energia2 + '&target_key=' + fundamental2 + '&target_loudness=' + amplitud +
                          '&target_mode=' + modo2 + '&target_speechiness=' + dialogo2 + '&target_acousticness=' + acustica2 + 
                          '&target_instrumentalness=' + instrumental2 + '&target_liveness=' + audiencia2 + '&target_valence=' + positivismo2 
                          + '&target_tempo=' + tempo2 + '&target_time_signature=' + firma_tiempo2,
                          headers: { 'Authorization': 'Bearer ' + access_token },
                          json: true
                        };  
                        
                        console.log(options3);

                        // use the access token to access the Spotify Web API
                        request.get(options3, function(error, response, body) {
                            if(error){console.log(error)}
                            console.log("Datos:");
                            console.log(body.tracks[0].name);
                            console.log(body.tracks[0].artists);
                            console.log(body.tracks[0].album.images[0].url);
                            
                            
                            anti_playlist = body;
                            
                            // we can also pass the token to the browser to make requests from there
                            res.redirect('/perfil#' +
                              querystring.stringify({
                                access_token: access_token,
                                refresh_token: refresh_token
                              }));
                        }); 
                        
                    }; 
                     
                  }, function(err) {
                    done(err);
                  });
                console.log('');    
            }); 
        });        
          
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }

});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

//console.log('Listening on 8888');
//app.listen(5000);


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/index.ejs', function(request, response) {
  response.render('pages/index');
});

app.get('/about-us.ejs', function(request, response) {
  response.render('pages/about-us');
});

app.get('/activity.ejs', function(request, response) {
  response.render('pages/activity.ejs');
});

app.get('/ajax_for_index.ejs', function(request, response) {
  response.render('pages/ajax_for_index');
});

app.get('/author-edit.ejs', function(request, response) {
  response.render('pages/author-edit');
});

app.get('/author-login.ejs', function(request, response) {
  response.render('pages/author-login');
});

app.get('/author.ejs', function(request, response) {
  response.render('pages/author');
});

app.get('/blog-2.ejs', function(request, response) {
  response.render('pages/blog-2');
});

app.get('/blog-3.ejs', function(request, response) {
  response.render('pages/blog-3');
});

app.get('/blog-detail-2.ejs', function(request, response) {
  response.render('pages/blog-detail-2');
});

app.get('/blog-detail.ejs', function(request, response) {
  response.render('pages/blog-detail');
});

app.get('/blog.ejs', function(request, response) {
  response.render('pages/blog');
});

app.get('/contact-us.ejs', function(request, response) {
  response.render('pages/contact-us');
});

app.get('/faq.ejs', function(request, response) {
  response.render('pages/faq');
});

app.get('/gallery.ejs', function(request, response) {
  response.render('pages/gallery');
});

app.get('/login.ejs', function(request, response) {
  response.render('pages/login');
});

app.get('/messages-2.ejs', function(request, response) {
  response.render('pages/messages-2');
});

app.get('/messages.ejs', function(request, response) {
  response.render('pages/messages');
});

app.get('/perfil', function(request, response) {

    response.render('pages/page1', {
    pais: pais,
    nombre: nombre,
    email: email,
    external_urls: external_urls,
    seguidores: seguidores,
    imagen_url: imagen_url,
    bailongo: bailongo,
    energia: energia,
    fundamental: fundamental,
    amplitud: amplitud,
    modo: modo,
    dialogo: dialogo,
    acustica: acustica,
    instrumental: instrumental,
    audiencia: audiencia,
    positivismo: positivismo,
    tempo: tempo,
    firma_tiempo: firma_tiempo,
    bailongo2: bailongo2,
    energia2: energia2,
    fundamental2: fundamental2,
    amplitud2: amplitud2,
    modo2: modo2,
    dialogo2: dialogo2,
    acustica2: acustica2,
    instrumental2: instrumental2,
    audiencia2: audiencia2,
    positivismo2: positivismo2,
    tempo2: tempo2,
    firma_tiempo2: firma_tiempo2,    
    duracion: duracion,
    duracion2: duracion2,
    followers: followers,
    anti_playlist: anti_playlist    
  });
    
});


app.get('/page2.ejs', function(request, response) {
  response.render('pages/page2');
});

app.get('/page3.ejs', function(request, response) {
  response.render('pages/page3');
});

app.get('/people.ejs', function(request, response) {
  response.render('pages/people');
});

app.get('/search.ejs', function(request, response) {
  response.render('pages/search');
});

app.get('/shortcodes.ejs', function(request, response) {
  response.render('pages/shortcodes');
});

app.get('/site-map.ejs', function(request, response) {
  response.render('pages/site-map');
});

app.get('/statictics.ejs', function(request, response) {
  response.render('pages/statictics');
});

app.get('/work.ejs', function(request, response) {
  response.render('pages/work');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


