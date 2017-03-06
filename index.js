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

var fileName = "./secret-config.json"
var config

try {
  config = require(fileName)
}
catch (err) {
  config = {}
  console.log("unable to read file '" + fileName + "': ", err)
  console.log("see secret-config-sample.json for an example")
}

console.log("session secret is:", config.sessionSecret);

var client_id = '381fa9402ef049efab1c1a801beef662'; // Your client id
var client_secret = config.sessionSecret; // Your secret
var redirect_uri = 'https://too-cool-for-a-logo.herokuapp.com/callback'; // Your redirect uri

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

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/autorizacion', function(req, res) {

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

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

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

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }

  response.render('pages/organization');
    
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

console.log('Listening on 8888');
app.listen(8888);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

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

app.get('/page1.ejs', function(request, response) {
  response.render('pages/page1');
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


