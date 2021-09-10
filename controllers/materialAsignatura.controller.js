const { exec } = require('child_process');
var mongoose = require('mongoose');
var Request = require("request");
const MaterialAsignatura = require("../models/materialAsignatura.model");
const HistorialAsignatura = require('../models/historialAsignatura.model');
const HistorialUsuario = require('../models/historial.model');
const Asignatura = require('../models/asignatura.model');
const Usuario = require("../models/usuario.model");

exports.newSubjectMaterial = function (request, response) {
    Asignatura.findById(request.body.idSubject, function (errorQuery, resultSubject) {
        if (errorQuery)
            response.json({ result: errorQuery });

        let newSubjectMaterial = new MaterialAsignatura({
            _id: new mongoose.Types.ObjectId,
            asignatura: resultSubject,
            titulo: request.body.titleMaterial,
            url: request.body.url,
            descripcion: request.body.description
        });

        newSubjectMaterial.save(function (errorQuerySave) {
            if (errorQuerySave)
                response.json({ result: "Ocurrió un error y no se pudo registrar el material ingresado." });

            Asignatura.findOneAndUpdate({ _id: request.body.idSubject },
                { $push: { materiales: newSubjectMaterial } },
                function (errorFindedSubject, successResult) {
                    if (errorFindedSubject)
                        response.json({ result: 'No se encontro la asignatura para asignarle el material ingresado.' });
                    response.json({ result: "El material fue guardado y asiganado a " + resultSubject.nombre });
                });
        })
    });
}

exports.getSubjectMaterials = function (request, response) {
    Asignatura.findOne({ codigo: request.body.codeSubject })
        .populate('materiales')
        .exec(function (errorQueryFinded, subjectSelected) {
            if (errorQueryFinded)
                response.json({ result: "No se encontro la asignatura seleccionada." });
            response.json({ result: subjectSelected.materiales, idSubject: subjectSelected.codigo });
        });
}

exports.newHistorySubjectMaterial = function (request, response) {
    Usuario.findById(request.body.idUser, function (errorQueryGetUser, objectUser) {
        if (errorQueryGetUser)
            response.json({ result: "Ocurrió un error y el usuario no fue obtenido." });

        Asignatura.findOne({ codigo: request.body.codeSubject }, (errorQueryGetSubject, objectSubject) => {
            if (errorQueryGetSubject)
                response.json({ result: "Ocurrió un error y la asignatura no fue obtenida." });

            MaterialAsignatura.findById(request.body.idSubjectMaterial, function (errorQueryGetMaterial, objectMaterial) {
                if (errorQueryGetMaterial)
                    response.json({ result: "Ocurrió un error y el material de la asignatura no fue obtenido." });

                let historySubjectMaterial = new HistorialAsignatura({
                    _id: new mongoose.Types.ObjectId,
                    usuario: objectUser,
                    material: objectMaterial,
                    asignatura: objectSubject,
                    fecha: request.body.currentDate,
                    hora: request.body.currentTime
                });

                historySubjectMaterial.save(function (errorQuerySaveHistory) {
                    if (errorQuerySaveHistory)
                        response.json({ result: "Ocurrió un eror y el registro en el historial no pudo crearse correctamente." });

                    Asignatura.findOneAndUpdate({ _id: objectSubject._id },
                        { $push: { historialMateriales: historySubjectMaterial } },
                        function (errorFindedSubject, successResult) {
                            if (errorFindedSubject)
                                response.json({ result: 'No se encontro la asignatura para vincular el registro del historial.' });

                            let newUserHistory = new HistorialUsuario({
                                _id: new mongoose.Types.ObjectId,
                                usuario: objectUser,
                                pregunta: objectMaterial.titulo + " de " + objectSubject.nombre,
                                respuesta: "Enlace a " + objectMaterial.titulo,
                                codAsignatura: objectSubject.codigo,
                                fecha: request.body.currentDate,
                                hora: request.body.currentTime
                            });
                           
                            newUserHistory.save(function (errorQuerySaveHistoryUser) {
                                if (errorQuerySaveHistoryUser)
                                    response.json({ errorResult: "No se pudo crear un registro en el historial de usuario" });

                                Usuario.findOneAndUpdate({ _id: objectSubject._id },
                                    { $push: { historialChat: newUserHistory } },
                                    function (errorFindedUser, successResultUser) {
                                        if (errorFindedUser)
                                            response.json({ errorResult: "Ocurrió un error y no se pudo hacer un registro en el historial de usuario." });

                                        response.json({ result: "Se creo un nuevo registro en el hsitorial de materia por el material descargado." });
                                    });
                            });
                        });
                });
            })
        });
    });
}

exports.getDetailSubjectMaterial = function (request, response) {
    MaterialAsignatura.findById(request.body.idMaterial)
        .populate('asignatura')
        .exec(function (errorQueryFinded, objectSubjectMaterial) {
            if (errorQueryFinded)
                response.json({ errorResult: "Ocurrió un erorr y no se pudo obtener el detalle del material seleccionado." });
            response.json({ result: objectSubjectMaterial });
        });
}

exports.updateSubjectMaterial = function (request, response) {

}

exports.deleteSubjectMaterial = function (request, response) {

}

exports.getStaticsMaterials = function (request, response) {

}

