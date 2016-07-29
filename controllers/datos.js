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

exports.getDatosFiltrados = function(req, res) {
	function toDate(dateStr) {
	    var parts = dateStr.split("/");
	    return new Date(parts[2], parts[1] - 1, parts[0]);
	}	
	//console.log("prueba 12 "+req.body.id_maquina+" "+req.body.fechaInicial+" "+req.body.fechaFinal);
	var fechaInicial =  toDate(req.body.fechaInicial);
	var fechaFinal =  toDate(req.body.fechaFinal);
	//console.log("fechas convertidas "+fechaInicial+" "+fechaFinal);
    //Datos.find({datos:{$elemMatch:{id:req.body.id_maquina}}}, function(err, datos){
    //Datos.find({datos:{$elemMatch:{id:req.body.id_maquina}}, fecha:{ $gt: fechaInicial, $lt: fechaFinal}}, function(err, datos){
    Datos.find({id_maquina:req.body.id_maquina, fecha:{ $gt: fechaInicial, $lt: fechaFinal}}, function(err, datos){
    	if(err){
    		return res.send("ko");
    	}
    	//console.log(datos);
    	return res.send(datos);
    });
};
