'use strict';

var mongoose = require('mongoose');

var datosModel = function() {

    var datosSchema = new mongoose.Schema({
        datos: Array,
        fecha: { type: Date, default: Date.now },
    }, {
        collection: 'datos'
    });

    return mongoose.model('Datos', datosSchema);
};

module.exports = new datosModel();