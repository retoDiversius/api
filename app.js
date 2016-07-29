var express = require('express'),
  app = express(),
  bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var cors = require('cors');  
var dotenv = require('dotenv');
var mqtt = require('mqtt');

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

var Datos = require("./models/datos");

var datosCtrl = require('./controllers/datos');
var auth = require('./controllers/auth');  
var middleware = require('./controllers/middleware');
var auth = require('./controllers/auth');  

// Rutas de autenticación y login
//app.post('/auth/signup', auth.emailSignup); // para crear usuario
app.post('/auth/login', auth.emailLogin); //para logearse

// Ruta solo accesible si estás autenticado
app.get('/private',middleware.ensureAuthenticated, function(req, res) {
	res.send(req.user);//_id del usuario si el token es correcto
} );

app.get('/datos', middleware.ensureAuthenticated, datosCtrl.getDatos);

app.post('/datos/filtro', middleware.ensureAuthenticated, datosCtrl.getDatosFiltrados);

//rutas de envio de datos sutituidos por MQTT
/*app.get('/datos', datosCtrl.getDatos);
app.post('/datos', datosCtrl.addDato);*/
//sin desarrollo
//app.put('/datos', datosCtrl.updateDato);
//app.delete('/datos', datosCtrl.deleteDato);

var client  = mqtt.connect(process.env.MQTT);

client.on('connect', function () {
    client.subscribe(process.env.CANALMQTT);
});

client.on('message', function(topic, message) {
  //console.log("mensaje: "+message);

  var informacion = message.toString('utf-8').split(",");
  
  //var size = informacion.length;
  
  /*var informacionParseada = [];
  informacionTratar.forEach(function(item) {
      informacionParseada.push(item.toString('utf-8').split(","));
  });*/
  
  console.log(informacion);
  
	var dato = new Datos({
	  id_maquina: informacion[0],
		datos: informacion
	});
	console.log(dato);
	//var dato = new Datos(req.body);
	dato.save(function(err) {
		if (err) {
			console.log('save error', err);
			console.log('ko');
		} else {
			//mensaje de ok si se guarda en bd
			console.log('Dato guardado correctamente');
		}
	});
  
});

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