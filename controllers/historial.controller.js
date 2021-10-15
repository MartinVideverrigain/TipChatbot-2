const { exec } = require('child_process');
var mongoose = require('mongoose');
var Request = require("request");
const HistorialChat = require("../models/historial.model");
const Usuario = require("../models/usuario.model");
const HistorialAsignatura = require("../models/historialAsignatura.model");
const { __await } = require('tslib');
const MaterialAsignatura = require('../models/materialAsignatura.model');
const Asignatura = require('../models/asignatura.model');

exports.getHistoryMaterials = async function (request, response) {
    Asignatura.findOne({ codigo: request.body.idSubject }, function (errorQuerySubject, responseGetSubject) {
        if (errorQuerySubject)
            response.json({ errorResult: "No se pudo obtener información de la asignatura." });

        HistorialAsignatura.aggregate([
            {
                $match: {
                    fecha: { $gte: request.body.startDate, $lt: request.body.endDate },
                }
            },
            {
                $group: {
                    _id: {
                        material: "$material",
                        asignatura: "$asignatura",
                        usuario: "$usuario"
                    },
                    "cantidad": { $sum: 1 }
                }
            }
        ]).exec(async function (errorQuery, listResult) {
            if (errorQuery)
                response.json({ errorQuery: errorQuery });

            let arrayMaterialsHistory = new Array();
            for (const item of listResult) {
                if (item._id.asignatura.equals(responseGetSubject._id)) {
                    let promiseGetMaterialAsignatura = () => {
                        return new Promise((resolve, reject) => {
                            MaterialAsignatura.findById(item._id.material).exec(function (errorGetUser, objectMaterialAsignatura) {
                                if (errorGetUser)
                                    response.json({ Reply: 'Error el usuario no existe' });

                                resolve(objectMaterialAsignatura);
                            })
                        });
                    };
                    let resultMaterialAsignatura = await promiseGetMaterialAsignatura();
                    arrayMaterialsHistory.push({
                        title: resultMaterialAsignatura.titulo,
                        cantidad: item.cantidad
                    });
                }
            }
            response.json({ listResult: arrayMaterialsHistory });
        });
    });
}

exports.historial_nuevo = function (request, response) {
    Usuario.findById(request.body.idUser, function (errorFinded, userSelected) {
        if (errorFinded) {
            response.json({ data: "El usuario en sesión no fue encontrado para agregar un registro en el historial." });
        }

        var historial = new HistorialChat(
            {
                _id: new mongoose.Types.ObjectId(),
                pregunta: request.body.question,
                respuesta: request.body.answer,
                usuario: userSelected,
                fecha: request.body.currentDate,
                hora: request.body.currentTime,
                codAsignatura: request.body.subjectCode
            }
        );

        historial.save(function (errorSaved) {
            if (errorSaved)
                response.json({ data: 'Ocurrió un error y no se pudo guardar un registro en el historial de usuario de la pregunta realizada.' });
            Usuario.findOneAndUpdate(
                { _id: request.body.idUser },
                { $push: { historialChat: historial } },
                function (errorFindedUser, success) {
                    if (errorFindedUser) {
                        console.log(errorFindedUser);
                        response.json({ data: 'No se encontro el usuario en sesión, y el registro del historial no fue asociado.' });
                    }
                    response.json({ data: 'Se creó un registro en el historial de usuario.' });
                });
        });
    })
};

exports.get_historial = function (request, response) {
    Usuario.findById(request.body.idUser, function (responseError, userSelected) {
        if (responseError)
            response.json({ data: "Ocurrio un error y no se pudo obtener el usuario" });

        HistorialChat.find({ usuario: userSelected }, function (responseErrorH, listHistory) {
            if (responseErrorH)
                response.json({ data: "Ocurrió un error y no se pudo obtener el historial correspondiente al usuario" });/*  */

            listHistory.forEach(element => {
                element.fecha = element.fecha.substr(6, 2) + "/" + element.fecha.substr(4, 2) + "/" + element.fecha.substr(0, 4);
            });

            response.json({ listHistory: listHistory });
        });
    });
};

exports.getCountQuestionByDate = function (request, response) {
    HistorialChat.find({ fecha: { $gte: request.body.startDate, $lt: request.body.endDate } }, function (errorQuery, listResponse) {
        if (errorQuery)
            response.json({ data: "Ocurrió un error y no se obtuvieron valores para la estadistica." });
    }).count(function (errorQueryCount, count) {
        if (errorQueryCount)
            response.json({ data: "Los resultados obtenidos no se pudieron contabilizar." });
        response.json({ countQuestions: count });
    });
};

exports.getCountQuestionsByUser = async function (request, response) {
    HistorialChat.aggregate([
        {
            $match: { fecha: { $gte: request.body.startDate, $lt: request.body.endDate } }
        },
        {
            $group: {
                _id: "$usuario",
                "cantidad": { $sum: 1 }
            }
        }
    ]).exec(async function (errorQuery, listResult) {
        if (errorQuery)
            response.json({ errorQuery: errorQuery });

        let arrayUsers = new Array();
        for (const item of listResult) {
            console.log(item)
            if (item._id) {
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        Usuario.findById(item._id).exec(function (errorGetUser, objectUser) {
                            if (errorGetUser)
                                response.json({ Reply: 'Error el usuario no existe' });

                            resolve(objectUser);
                        })
                    });
                };

                let user = await myPromise();
                arrayUsers.push({ cedula: user.cedula, nombre: user.nombre + " " + user.apellido, cantQuerys: item.cantidad });
            } else arrayUsers.push({ cedula: "Usuario eliminado", nombre: "No corresponde", cantQuerys: item.cantidad });
        }

        arrayUsers.sort(function (itemA, itemB) {
            if (itemA.cantQuerys < itemB.cantQuerys)
                return 1;
            if (itemA.cantQuerys > itemB.cantQuerys)
                return -1;
            return 0;
        });

        response.json({ listResult: arrayUsers });
    })
};

exports.getCountSubjectConsult = function (request, response) {
    HistorialChat.aggregate([
        {
            $match: {
                fecha: { $gte: request.body.startDate, $lt: request.body.endDate }
            }
        }, {
            $group: {
                _id: "$codAsignatura",
                "cantidad": { $sum: 1 }
            }
        }
    ]).exec(function (errorQuery, listResult) {
        if (errorQuery)
            response.json({ errorQuery: errorQuery });

        listResult.sort(function (itemA, itemB) {
            if (itemA.cantidad < itemB.cantidad)
                return 1;
            if (itemA.cantidad > itemB.cantidad)
                return -1;
            return 0;
        });
        response.json({ listResult: listResult });
    });
}

exports.getConsultsBySubject = function (request, response) {
    HistorialChat.aggregate([
        {
            $match: {
                codAsignatura: request.body.codeSubject,
            }
        },
        {
            $group: {
                _id: {
                    pregunta: "$pregunta",
                    fecha: "$fecha"
                },
                "cantidad": { $sum: 1 }
            }
        }
    ]).exec(function (errorQuery, listConsults) {
        if (errorQuery)
            response.json({ errorResult: "Ocurrió un error y no se pudieron obtener las preguntas sobre la asginatura." });

        let arrayResult = new Array();
        for (const item of listConsults) {
            if (request.body.startDate < item._id.fecha && request.body.endDate > item._id.fecha)
                arrayResult.push(item);
        }

        response.json({ listResult: arrayResult });
    });
}