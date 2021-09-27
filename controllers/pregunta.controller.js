var mongoose = require('mongoose');
var Request = require("request");
const PreguntaPendiente = require('../models/preguntaPendiente.model');
const Usuario = require('../models/usuario.model');
const UsuarioAsignatura = require('../models/usuarioAsignatura.model');
const Asignatura = require('../models/asignatura.model');
const Feriado = require('../models/feriado.model');
const Previa = require('../models/previa.model');
const Horario = require('../models/horario.model');
const Evaluacion = require('../models/evaluacion.model');
const Laboratorio = require('../models/laboratorio.model');

exports.insertUnansweredQuestion = function (request, response) {
    let preguntaPendiente = new PreguntaPendiente(
        {
            _id: new mongoose.Types.ObjectId(),
            pregunta: request.body.question,
        }
    );

    preguntaPendiente.save(function (errorQuery) {
        if (errorQuery)
            response.json({ errorResult: "Ocurrió un error y la pregunta no fue almacenada correctamente" });

        response.json({ result: "Pregunta agregada con éxito" });
    })
};

exports.getUnansweredQuestions = function (request, response) {
    PreguntaPendiente.find({}, function (errorQuery, listQuestions) {
        if (errorQuery)
            response.json({ errorQuery: "Ocurrió un error y no se pudo obtener el listado de preguntas pendientes" });
        response.json({ result: listQuestions });
    });
};

exports.deleteUnansweredQuestion = function (request, response) {
    PreguntaPendiente.findByIdAndRemove(request.body.idQuestion, function (errorQuery, responseDelte) {
        if (errorQuery)
            response.json({ errorResult: "Ocurrió un error y no se pudo eliminar la pregunta pendiente resuelta." })
        response.json({ result: 'La pregunta pendiente fue correctamente resuelta.' });
    });
}

exports.pregunta_listado = function (req, res) {

    Pregunta.find({}, function (err, preguntas) {
        if (err) {
            res.json({ data: 'Error no hay preguntas' });
        }
        res.json({ data: preguntas });
    });
};

exports.pregunta_FAQcal1 = async function (req, res) {
    Usuario.findById(req.body.id, async function (err, user) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error el usuario no existe' });
        }

        var suma = 0;
        for (const item of user.usuarioAsignaturas) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    UsuarioAsignatura.findById(item._id).populate('asignatura').exec(function (err, uA) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error el usuario no existe' });
                        }
                        if (uA.estado == "Exonerada") {
                            resolve(uA.asignatura.creditos);
                        } else {
                            resolve(0);
                        }
                    })
                });
            };
            suma += await myPromise();
        }
        res.json({ Reply: 'Tienes ' + suma + ' créditos obtenidos!' });
    })
};

//cuantos creditos me faltan?
exports.pregunta_FAQcal2 = async function (req, res) {
    Usuario.findById(req.body.id, async function (err, user) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error el usuario no existe' });
        }

        var suma = 0;
        for (const item of user.usuarioAsignaturas) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    UsuarioAsignatura.findById(item._id).populate('asignatura').exec(function (err, uA) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error el usuario no existe' });
                        }
                        if (uA.estado == "Exonerada") {
                            resolve(uA.asignatura.creditos);
                        } else {
                            resolve(0);
                        }
                    })

                });
            };
            suma += await myPromise();
        }
        res.json({ Reply: 'La cantidad de creditos que le faltan para obtener el titulo es de: ' + (252 - suma) });
    })

};

//estoy en condiciones de realizar la pasantia laboral
exports.pregunta_FAQcal3 = async function (req, res) {
    Usuario.findById(req.body.id, async function (err, user) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error el usuario no existe' });
        }

        var cont = 0;
        for (const item of user.usuarioAsignaturas) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    UsuarioAsignatura.findById(item._id).populate('asignatura').exec(function (err, uA) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error el usuario no existe' });
                        }
                        if (uA.estado == "Exonerada") {
                            if (uA.asignatura.codigo == "arq" || uA.asignatura.codigo == "so" || uA.asignatura.codigo == "red" ||
                                uA.asignatura.codigo == "pp" || uA.asignatura.codigo == "eda" || uA.asignatura.codigo == "pa" ||
                                uA.asignatura.codigo == "bd1" || uA.asignatura.codigo == "bd2") {
                                resolve(1);
                            } else {
                                resolve(0);
                            }
                        } else {
                            resolve(0);
                        }
                    })
                });
            };
            cont += await myPromise();
        }
        if (cont == 8) {
            res.json({ Reply: 'Si, estás en condiciones de realizar la Pasantía Laboral' });
        } else {
            res.json({ Reply: 'No, no estás en condiciones de realizar la Pasantía Laboral' });
        }
    })
};

exports.pregunta_FAQcal4 = async function (req, res) {
    Usuario.findById(req.body.id, async function (err, user) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error el usuario no existe' });
        }

        var cont = 0;
        for (const item of user.usuarioAsignaturas) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    UsuarioAsignatura.findById(item._id).populate('asignatura').exec(function (err, uA) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error el usuario no existe' });
                        }
                        if (uA.estado == "Exonerada") {
                            if (uA.asignatura.codigo == "arq" || uA.asignatura.codigo == "so" || uA.asignatura.codigo == "adm1" ||
                                uA.asignatura.codigo == "red" || uA.asignatura.codigo == "ingsof" || uA.asignatura.codigo == "mdl1" ||
                                uA.asignatura.codigo == "mdl2" || uA.asignatura.codigo == "pp" || uA.asignatura.codigo == "eda" ||
                                uA.asignatura.codigo == "pa" || uA.asignatura.codigo == "progapl" || uA.asignatura.codigo == "bd1" ||
                                uA.asignatura.codigo == "bd2") {
                                resolve(1);
                            } else {
                                resolve(0);
                            }
                        } else {
                            resolve(0);
                        }
                    })

                });
            };
            cont += await myPromise();
        }
        if (cont == 13) {
            res.json({ Reply: 'Si, estás en condiciones de realizar el Proyecto Final' });
        } else {
            res.json({ Reply: 'No, no estás en condiciones de realizar el Proyecto Final' });
        }
    })
};

exports.pregunta_FAQcal5 = async function (req, res) {

    var f = new Date();

    Feriado.find({}, async function (err, feriado) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error no hay feriados' });
        }
        var dev = "";
        var cont = 0;
        for (const fec of feriado) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {

                    if (fec.fecha.getDate() + "/" + (fec.fecha.getMonth() + 1) == (f.getDate() + 1) + "/" + (f.getMonth() + 1)) {
                        resolve(fec.motivo);
                        cont += 1;
                    } else {
                        resolve("");
                    }
                })
            };
            dev += await myPromise();
        }
        if (cont == 1) {
            res.json({ Reply: 'Mañana no hay clases debido al feriado de: ' + dev });
        } else {
            res.json({ Reply: 'Mañana hay clases!' });
        }
    })
};

//hoy hay clases?
exports.pregunta_FAQcal7 = async function (req, res) {

    var f = new Date();

    Feriado.find({}, async function (err, feriado) {
        if (err) {
            console.log(err);
            res.json({ Reply: 'Error no hay feriados' });
        }
        var dev = "";
        var cont = 0;
        for (const fec of feriado) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {

                    if (fec.fecha.getDate() + "/" + (fec.fecha.getMonth() + 1) == f.getDate() + "/" + (f.getMonth() + 1)) {
                        resolve(fec.motivo);
                        cont += 1;
                    } else {
                        resolve("");
                    }
                })
            };
            dev += await myPromise();
        }
        if (cont == 1) {
            res.json({ Reply: 'Hoy no hay clases debido al feriado de: ' + dev });
        } else {
            res.json({ Reply: 'Hoy hay clases!' });
        }
    })
};

//puedo hacer x materia?
exports.pregunta_FAQcal8 = async function (request, response) {
    Asignatura.findOne({ codigo: request.body.codigo }, async function (errorQuery, objectAsignatura) {
        if (errorQuery)
            response.json({ Reply: 'La asignatura no fue encontrada.' });

        var cont = 0;
        var cantPrevias = 0;
        if (objectAsignatura && objectAsignatura.previas) {
            for (const previa of objectAsignatura.previas) {
                var myPromise = () => {
                    return new Promise((resolve, reject) => {
                        Previa.findById(previa._id).populate('asignatura').exec(function (err, asigP) {
                            if (err) {
                                console.log(err);
                                response.json({ Reply: 'Error la asignatura no existe' });
                            }
                            UsuarioAsignatura.find({ $and: [{ usuario: request.body.id }, { estado: "Exonerada" }] }).populate('asignatura').exec(function (err, uA) {
                                if (err) {
                                    console.log(err);
                                    response.json({ Reply: 'Error el usuario no existe' });
                                }
                                uA.find(function (item) {
                                    if (String(item.asignatura._id) == String(asigP.asignatura._id)) {
                                        resolve(1);
                                    }
                                });
                                resolve(0);
                            })
                        })
                    });
                };
                cantPrevias += 1;
                cont += await myPromise();
            }
            if (cont == cantPrevias) {
                response.json({ Reply: 'Si, estás en condiciones de realizar esta materia' });
            } else {
                response.json({ Reply: 'No, no estás en condiciones de realizar esta materia' });
            }
        } else response.json({ result: "Ocurrió un error y la información de la asignatura no fue obtenida." });
    })
};

//horario de x materia?
exports.pregunta_FAQcal9 = async function (req, res) {
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var cont = "Los horarios de " + asig.nombre + " son: ";
        for (const horario of asig.horarios) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    Horario.findById(horario._id, function (err, asigH) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error el horario no existe' });
                        }
                        resolve(asigH.dia + " desde: " + asigH.horaDesde + ", hasta: " + asigH.horaHasta + " <br>")
                    })
                });
            };
            cont += await myPromise();
        }
        res.json({ Reply: cont });
    })
};

//evaluaciones de x materia?
exports.pregunta_FAQcal10 = async function (req, res) {
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var cont = "Las evaluaciones de " + asig.nombre + " son: ";
        for (const ev of asig.evaluaciones) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    Evaluacion.findById(ev._id, function (err, asigE) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error la evaluacion no existe' });
                        }
                        var fecha = asigE.fecha.getDate() + "/" + (asigE.fecha.getMonth() + 1);
                        if (asigE.tipo == "Laboratorio") {
                            Laboratorio.findById(asigE.laboratorio, function (err, lab) {
                                var fechaE = lab.fechaEntrega.getDate() + "/" + (lab.fechaEntrega.getMonth() + 1)
                                var fechaD = lab.fechaDefensa.getDate() + "/" + (lab.fechaDefensa.getMonth() + 1)
                                resolve(asigE.tipo + ": " + asigE.nombre + ", Fecha de entrega: " + fechaE + ", Fecha de defensa: " + fechaD + " <br>")
                            })
                        } else {
                            resolve(asigE.tipo + ": " + asigE.nombre + ", Fecha: " + fecha + "<br>")
                        }
                    })
                });
            };
            cont += await myPromise();
        }
        res.json({ Reply: cont });
    })
};

//quien dicta x materia?
exports.pregunta_FAQcal11 = async function (req, res) {
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var cont = "Quien dicta la materia " + asig.nombre + " es: " + asig.nombreDoc + " y su correo electrónico es: " + asig.correoDoc;
        res.json({ Reply: cont });
    })
};

//cual es la fecha limite de inscripcion a x asignatura?
exports.pregunta_FAQcal12 = async function (req, res) {
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var fecha = asig.fechaInscripcion.getDate() + "/" + (asig.fechaInscripcion.getMonth() + 1)
        var cont = "El límite de inscripción a esta asignatura es hasta el: " + fecha;
        res.json({ Reply: cont });
    })
};

//cuantos creditos otorga x materia?
exports.pregunta_FAQcal13 = async function (req, res) {
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var cont = "La materia " + asig.nombre + " otorga: " + asig.creditos + " créditos.";
        res.json({ Reply: cont });
    })
};
