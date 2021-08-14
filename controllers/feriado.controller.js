var mongoose = require('mongoose');
var Request = require("request");
const Feriado = require('../models/feriado.model');

exports.feriado_nuevo = function (req, res) {

          var feriado = new Feriado(
            {
              _id: new mongoose.Types.ObjectId(),
              fecha: req.body.fecha,
              motivo: req.body.motivo
            }
        );

        feriado.save(function (err) {
            if (err) {
                console.log(err);
                res.json({data:'Error'});
            }
        res.json({data:'Feriado agregado con éxito'});

        })
};

exports.feriado_detalle = function (req, res) {

    Feriado.findById(req.body.id, function (err, fer) {
        if (err) {
        	console.log(err);
	            res.json({data:'Error el feriado no existe'});
        }
        res.json({feriado: fer});
    })
};

exports.feriado_listado = function (req, res) {

    Feriado.find({}, function(err, feriados) {
      if (err) {
        console.log(err);
            res.json({data:'Error no hay feriados'});
      }
         res.json({data:feriados});
      });
};

exports.feriado_delete = function(req,res){

    Feriado.findByIdAndRemove(req.body.id,function(err,fer){
      if(err){
        console.log(err);
        res.json({data:'Error el feriado no existe'});
      }
      res.json({data:'Eliminado con exito'});
    })

};


/*
var f = new Date();
document.write(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
*/
