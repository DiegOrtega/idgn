
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
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

app.get('/organization.ejs', function(request, response) {
  response.render('pages/organization');
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


