var mongoose = require('mongoose');
var Request = require("request");
const HistorialChat = require("../models/historial.model");
const Usuario = require("../models/usuario.model");

exports.historial_nuevo = function (req, res) {
    Usuario.findById(req.body.idUser, function (errorFinded, userSelected) {
        if (errorFinded) {
            console.log(errorFinded);
            res.json({ data: "El usuario en sesión no fue encontrado para agregar un registro en el historial." });
        }

        var historial = new HistorialChat(
            {
                _id: new mongoose.Types.ObjectId(),
                pregunta: req.body.question,
                respuesta: req.body.answer,
                usuario: userSelected,
                fecha: req.body.dateTimeUy
            }
        );

        historial.save(function (err) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error' });
            }

            Usuario.findOneAndUpdate(
                { _id: req.body.idUser },
                { $push: { historialChat: historial } },
                function (error, success) {
                    if (error) {
                        console.log(error);
                        res.json({ data: 'Error user' });
                    }

                    res.json({ data: 'Se creó un registro en el historial de usuario.' });
                });
        });
    })
};

exports.get_historial = function (request, response) {
    Usuario.findById(request.body.idUser, function (responseError, userSelected) {
        if (responseError) {
            console.log(responseError);
            response.json({ data: "Ocurrio un error y no se pudo obtener el usuario" });
        }

        HistorialChat.find({ usuario: userSelected }, function (responseErrorH, listHistory) {
            if (responseErrorH) {
                console.log(responseErrorH);
                response.json({ data: "Ocurrió un error y no se pudo obtener el historial correspondiente al usuario" });
            }
            console.log(listHistory)
            response.json({ listHistory: listHistory });
        });
    });
};
