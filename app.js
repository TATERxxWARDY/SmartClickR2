/***********
*  SmartClickR
*  Version 0.4.7
*  Authors: Daniel To, Jimmy Dempsey, Brad Fischer, Billy Godfrey
**/

var express = require('express')
  , app = require('express')()
  , routes = require('./routes')
  , user = require('./routes/user')
  , poll = require('./routes/poll')
  , question = require('./routes/question')
  , http = require('http')
  , path = require('path')
  , lessMiddleware = require('less-middleware')
  , less = require('less')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('the-secret-is-at-klines'));
  app.use(express.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'vendor')));
  app.use(lessMiddleware({
	 src			: __dirname + "public",
	 compress	: true
	}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(function(request, response, next) {
	  response.render('404.jade', {title: 'SmartClickR | This page got lost', layout:'404_layout'});	
  });
});

question.createSocket(io);

// main pages //
app.get('/', routes.index);
app.get('/features', routes.features);
app.get('/help', routes.help);
app.get('/samples', routes.samples);
app.get('/about', routes.about);
app.get('/blog', routes.blog);
app.get('/contact', routes.contact);
app.post('/contact', routes.postContact);
app.get('/data', routes.data);
app.get('/privacy', routes.privacy);
app.get('/terms', routes.terms);
app.get('/getting-started-with-smartclickr', routes.gettingStarted);

// user pages //
app.get('/user/create', user.signup);
app.post('/user/create', user.createUser);
app.get('/login', user.getLogin);
app.post('/login', user.postLogin);
app.get('/lostpassword', routes.lostPassword);
app.post('/lostpassword', user.postLostPassword);
app.get('/reset-password', routes.resetPassword);
app.post('/reset-password', user.postResetPassword);
app.get('/user/:User_ID', user.getHome);
app.get('/user/edit/:User_ID', user.getAccount);
app.post('/user/edit/:User_ID', user.updatePassword);
app.post('/user/delete/:User_ID', user.delete);
app.get('/good-bye', user.getFeedback);
app.get('/logout', user.logout);

// poll pages //
app.get('/user/:User_ID/poll/create', poll.getCreatePoll);
app.post('/user/:User_ID/poll/create', poll.postCreatePoll);
app.get('/user/:User_ID/poll/edit/:Poll_ID', poll.getEditPoll);
app.post('/user/:User_ID/poll/delete/:Poll_ID', poll.deletePoll);

// question pages //
app.post('/user/:User_ID/poll/:Poll_ID/question/create', question.postNewQuestion);
app.post('/user/:User_ID/poll/edit/:Poll_ID', question.postEditPoll);
app.post('/user/:User_ID/poll/:Poll_ID/question/delete/:Question_ID', question.deleteQuestion);

// responding pages //
app.get('/poll/:SessionCode', poll.getPollQuestions);
app.get('/poll/:SessionCode/question/:Question_ID', question.pollQuestion);
app.post('/poll/:SessionCode/question/:Question_ID', question.postResponse);

// poll present pages //
app.get('/user/:User_ID/poll/:Poll_ID?', poll.presentLandingPage);
app.get('/user/:User_ID/poll/:Poll_ID/present/final', poll.presentFinal);
app.get('/user/:User_ID/poll/:Poll_ID/question/:Question_ID.json', question.responseData);
app.get('/user/:User_ID/poll/:Poll_ID/question/present/:Question_ID', question.presentPollQuestion);


// The Playground //

app.get('/playground', routes.playground);
app.get('/playground/email', routes.email);
app.get('/playground/test1', routes.playground_hometest1);
app.get('/playground/test2', routes.playground_hometest2);


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

