var mongoose = require('mongoose');
var Request = require("request");
const xlsxFile = require('read-excel-file/node');
const fs = require('fs');
const formidable = require('formidable');
const Usuario = require('../models/usuario.model');
const UsuarioAsignatura = require('../models/usuarioAsignatura.model');
const Asignatura = require('../models/asignatura.model');

exports.prueba_excel = function(req,res){

  xlsxFile('./planillas/Data.xlsx').then((rows) => {
   console.log(rows);
   console.table(rows);
  })

};

exports.prueba_excel2 = function(req,res){

  xlsxFile('./planillas/Data.xlsx').then((rows) => {

        for (var i = 1; i < rows.length ; i++){
               for (j in rows[i]){
                   if(j!=1){
                     console.dir(rows[i][j]);
                   }
               }
        }
   })

};

exports.alta_excel = async function(req,res){

  xlsxFile('./planillas/Data.xlsx').then( async (rows) => {

        var dev = 0;

        for (var i = 1; i < rows.length ; i++){
                     //console.dir(rows[i][j]);

                     var myPromise = () => {
                       return new Promise((resolve, reject) => {

                        Usuario.findOne({ cedula: rows[i][2]}, (erro, usuarioDB)=>{
                             if (!usuarioDB) {
                               res.json({data:'El usuario '+rows[i][2]+' no existe'});
                             }else {
                               Asignatura.findOne({ codigo: rows[i][0]}, (erro, asignaturaDB)=>{
                                     if (!asignaturaDB) {
                                       res.json({data:'La asignatura '+rows[i][0]+' no existe'});
                                     }else{

                                       UsuarioAsignatura.find({ $and: [ {usuario: usuarioDB._id}, {asignatura: asignaturaDB._id} ]}, function(err, usAsDB) {


                                           if (usAsDB[0] == undefined) {
                                             var usuarioAsignatura = new UsuarioAsignatura(
                                               {
                                                 _id: new mongoose.Types.ObjectId(),
                                                 estado: rows[i][3],
                                                 usuario: usuarioDB,
                                                 asignatura: asignaturaDB
                                               }
                                             );

                                             usuarioAsignatura.save(function (err) {
                                               if (err) {
                                                   console.log(err);
                                                   res.json({data:'Error'});
                                               }

                                               Usuario.findOneAndUpdate(
                                                { _id: usuarioDB._id },
                                                { $push: { usuarioAsignaturas: usuarioAsignatura  } },
                                               function (error, success) {
                                                     if (error) {
                                                         console.log(error);
                                                         res.json({data:'Error user'});
                                                     }

                                                     Asignatura.findOneAndUpdate(
                                                      { _id: asignaturaDB._id },
                                                      { $push: { usuarioAsignaturas: usuarioAsignatura  } },
                                                     function (error, success) {
                                                           if (error) {
                                                               console.log(error);
                                                               res.json({data:'Error asig'});
                                                           }
                                                     console.log("Agregado nuevo con exito");
                                                     resolve(1)
                                                     });
                                                 });
                                           })
                                           }else{
                                             UsuarioAsignatura.findByIdAndUpdate(usAsDB[0]._id,{estado: rows[i][3]},function (err, uA) {
                                                 if (err) {
                                                   console.log(err);
                                                       res.json({data:'Error el usuario no existe'});
                                                 }
                                                 console.log("Modificado con exito");
                                                 resolve(1)
                                              })
                                           }

                                       })

                                     }
                               })
                             }
                         })

                       })
                     };

                 dev += await myPromise();

        }

        if (dev == (rows.length - 1)) {
          res.json({data:'Todo legal'});
        }else {
          res.json({data:'Algo anda mal...'});
        }
   })

};

exports.download_excel = function (req, res) {
    var filePath = "./planillas/plantilla.xlsx";
    var fileName = "plantilla.xlsx";
    res.download(filePath, fileName);
};

exports.upload_excel = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = './planillas/' + "Data.xlsx";
        fs.rename(oldpath, newpath, function (err) {
          if (err){
            res.json({data:'Error al subir el archivo'});
          }
          res.json({data:'Archivo subido!'});
      });
    });
};
