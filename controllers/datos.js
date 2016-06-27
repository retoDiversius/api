var Datos = require("../models/datos");

exports.addDato = function(req, res) {
	console.log("post de datos");
	console.log(req.body);
	var dato = new Datos({
		datos: req.body
	});
	//var dato = new Datos(req.body);
	dato.save(function(err) {
		if (err) {
			console.log('save error', err);
			res.send('ko');
		} else {
			//mensaje de ok si se guarda en bd
			res.send('Dato guardado correctamente');
		}
	});
};

exports.getDatos = function(req, res) {
    Datos.find({}, function(err, datos){
    	if(err){
    		return res.send("ko");
    	}
    	return res.send(datos);
    });
};