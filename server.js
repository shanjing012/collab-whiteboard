//init and create server

//require express
var express = require('express');
//create the app with express
var app = express();

//create a server with the express server app creation
var server = require('http').createServer(app);

//wrap the socket io to intercept connections
var io = require('socket.io')(server);
var port = 8080;

//use ejs and express layout first
var expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(expressLayouts);

//then use router
var router = require('./app/routes');
app.use('/', router);

//set static files (css images and javascript etc) location
app.use(express.static(__dirname + '/public'));

//whenever someone connects
io.on('connection', function(socket) {
   console.log(io.engine.clientsCount + ' users');
   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
   
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log(io.engine.clientsCount + ' users');
   });
});

//start server
server.listen(port, function(){
	console.log('app started');
});