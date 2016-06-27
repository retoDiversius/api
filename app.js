var express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var cors = require('cors');  
var dotenv = require('dotenv');

app.use(cors());  

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expressValidator());

dotenv.load({
  path: './.env'
});

var datosCtrl = require('./controllers/datos');
var auth = require('./controllers/auth');  
var middleware = require('./controllers/middleware');
var auth = require('./controllers/auth');  

// Rutas de autenticación y login
app.post('/auth/signup', auth.emailSignup); // para crear usuario
app.post('/auth/login', auth.emailLogin); //para logearse

// Ruta solo accesible si estás autenticado
app.get('/private',middleware.ensureAuthenticated, function(req, res) {
	res.send(req.user);//_id del usuario si el token es correcto
} );

//app.get('/', loginCtrl.index);
//app.post('/', loginCtrl.login);

// Rutas de autenticación y login
app.post('/auth/signup', auth.emailSignup); // para crear usuario
app.post('/auth/login', auth.emailLogin); //para logearse

// Ruta solo accesible si estás autenticado
app.get('/private',middleware.ensureAuthenticated, function(req, res) {
	res.send(req.user);//_id del usuario si el token es correcto
} );

//rutas de envio de datos sutituidos por MQTT
/*app.get('/datos', datosCtrl.getDatos);
app.post('/datos', datosCtrl.addDato);*/
//sin desarrollo
//app.put('/datos', datosCtrl.updateDato);
//app.delete('/datos', datosCtrl.deleteDato);

/**
 * Start Express server.
 */
var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || CUSTOM_PORT;
//var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8443;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || CUSTOM_IP;

app.listen(server_port, server_ip_address, function() {
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
  mongoose.connect(process.env.MONGODB);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: :( '));
  db.once('open', function callback() {
    console.log('db connection open');
  });
});