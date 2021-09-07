const { exec } = require('child_process');
var mongoose = require('mongoose');
var Request = require("request");
const HistorialChat = require("../models/historial.model");
const Usuario = require("../models/usuario.model");

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

exports.getCountQuestionsByUser = function (request, response) {
    Usuario.find({ nombre: { $regex: request.body.textToSearch, $options: 'i' } }, function (errorQuery, listResult) {
        if (errorQuery)
            response.json({ data: "Ocurrió un eror y no se pudieron listar los usuarios y la cantidad de preguntas." });

        let arrayList = new Array();
        listResult.forEach(item => {
            let newItem = { "ci": item.cedula, "nombre": item.nombre + " " + item.apellido, "cantQuerys": item.historialChat.length };
            arrayList.push(newItem);
        })
        response.json({ listResult: arrayList });
    });
};

exports.getCountSubjectConsult = function (request, response) {
    HistorialChat.aggregate([
        {
            $group: {
                _id: "$codAsignatura",
                "cantidad": { $sum: 1 }
            }
        }
    ]).then(data => {
        response.json({ listResult: data });
    }).catch(errorQuery => {
        response.json({ data: errorQuery });
    });
}

exports.getConsultsBySubject = function (request, response) {
    HistorialChat.aggregate([
        {
            $match: {
                codAsignatura: request.body.codeSubject
            }
        },
        {
            $group: {
                _id: "$pregunta",
                "cantidad": { $sum: 1 }
            }
        }
    ]).then(data => {
        response.json({ listResult: data });
    }).catch(errorQuery => {
        response.json({data: errorQuery});
    });
}
