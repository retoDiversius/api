// auth.js
//var mongoose = require('mongoose');  
var User = require('../models/user'); 
//para crear el token
var service = require('./services');

var bcrypt = require('bcrypt');

//esto es solo para crear usuarios para tener alguno de prueba
/*exports.emailSignup = function(req, res) {  
    var user = new User({
        nombre:req.body.nombre,
        correo:req.body.correo,
        password:req.body.password
    });

    user.save(function(err){
        return res
            .status(200)
            .send({token: service.createToken(user)});
    });
};*/


//login normal (en tu caso en la función del passport)
exports.emailLogin = function(req, res) {  
    User.findOne({correo: req.body.correo.toLowerCase()}, function(err, user) {
        if(err){console.log(err);}
        bcrypt.compare(req.body.password, user.password, function(err, resultado) {
            if(err){console.log(err);}
            isMatch(err, resultado);
        });
        
        //si se loguea correctamente enviamos el token al cliente
        function isMatch(err, resultado){
            if(err){
                return res.send({error: "error"});
            }
            if(!resultado){
                return res.send({error: "error de autentificacion"});
            }
            return res
                .status(200)
                //enviamos el token al cliente para que lo guarde y lo utilice en cada peticion
                .send({token: service.createToken(user)});
        }
    });
};