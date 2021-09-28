var mongoose = require('mongoose');
var Request = require("request");
const Asignatura = require('../models/asignatura.model');
const Usuario = require('../models/usuario.model');
const UsuarioAsignatura = require('../models/usuarioAsignatura.model');
const Previa = require('../models/previa.model');
const Horario = require('../models/horario.model');
const Evaluacion = require('../models/evaluacion.model');
const Parcial = require('../models/parcial.model');
const Examen = require('../models/examen.model');
const Laboratorio = require('../models/laboratorio.model');

exports.getSubjectDetail = function (request, response) {
    Asignatura.findById(request.body.idSubject)
        .populate('horarios')
        .populate('materiales')
        .populate({
            path: 'previas',
            populate: {
                path: 'asignatura'
            }
        })
        .populate('evaluaciones')
        .exec(function (errorQuery, resultDetail) {
            if (errorQuery)
                response.json({ errorResult: errorQuery })

            response.json({ result: resultDetail });
        });
}

exports.getAsignaturasNoVinculadas = function (request, response) {
    Asignatura.findById(request.body.idSubject)
        .populate(
            {
                path: 'previas'
            }
        ).exec(function (errorQuery, listResult) {
            if (errorQuery)
                response.json({ errorResult: "Ocurrió un error y no se pudieron obtener las previas de la asignatura." });

            let arrayQuery = new Array();
            for (const item of listResult.previas) {
                arrayQuery.push(item.asignatura);
            }

            Asignatura.find({ _id: { $nin: arrayQuery } }, {})
                .exec(function (errorSecondQuery, listSecondResult) {
                    if (errorSecondQuery)
                        response.json({ errorResult: "Ocurrió un error" });

                    response.json({ listResult: listSecondResult });
                })
        });
}


exports.asignatura_nueva = function (req, res) {

    Asignatura.findOne({ codigo: req.body.codigo }, (erro, asignaturaDB) => {
        if (!asignaturaDB) {
            var asignatura = new Asignatura(
                {
                    _id: new mongoose.Types.ObjectId(),
                    codigo: req.body.codigo,
                    nombre: req.body.nombre,
                    semestre: req.body.semestre,
                    creditos: req.body.creditos,
                    programa: req.body.programa,
                    apruebaPor: req.body.apruebaPor,
                    nombreDoc: req.body.nombreDoc,
                    correoDoc: req.body.correoDoc,
                    fechaInscripcion: req.body.fechaInscripcion
                }
            );
            asignatura.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error' });
                }
                res.json({ data: 'Asignatura agregada con éxito' });

            })
        } else {
            res.json({ data: 'El código ya ha sido registrado' });
        }
    })
};

exports.asignatura_nuevaPrevia = function (request, response) {
    Asignatura.findById(request.body.idSubjectPrevious, function (errorQuery, objectSubjectPrevious) {
        if (errorQuery)
            response.json({ errorResult: 'La previa seleccionada no fue encontrada en la base de datos.' });

        let newPrevia = new Previa({
            _id: new mongoose.Types.ObjectId(),
            tipo: request.body.typeAprov,
            asignatura: objectSubjectPrevious
        });

        newPrevia.save(function (errorSave) {
            if (errorSave)
                response.json({ errorResult: 'Ocurrió un error y la previa no pudo guardarse en la base de datos.' });

            Asignatura.findOneAndUpdate(
                { _id: request.body.idSubject },
                { $push: { previas: newPrevia } },
                function (errorSavePrevia, successSavePrevia) {
                    if (errorSavePrevia)
                        response.json({ errorResult: 'Ocurrió un error y la previa no fue vinculada a la materia seleccionada.' });

                    let newSubjectPrevia = {
                        idPrevious: newPrevia._id,
                        materia: objectSubjectPrevious.nombre,
                        condicion: request.body.typeAprov,
                        creditos: objectSubjectPrevious.creditos,
                        docente: objectSubjectPrevious.nombreDoc,
                        aprobacion: objectSubjectPrevious.apruebaPor
                    };
                    response.json({ result: 'La previa fue agregada correctamente', newPrevia: newSubjectPrevia });
                });
        })
    })
};

exports.asignatura_deletePrevia = function (request, response) {

    Previa.findById(request.body.idPrevious, function (errorQueryGetPrevious, objectPrevious) {
        if (errorQueryGetPrevious)
            response.json({ errorResult: 'La asginatura previa seleccionada no fue encontrada' });

        Asignatura.findById(request.body.idSubject, function (errorQueryGetSubject, objectSubject) {
            if (errorQueryGetSubject)
                response.json({ errorResult: 'La asignatura asignada como previa no fue encontrada.' });

            objectSubject.previas.pull({ _id: objectPrevious._id });
            Asignatura.findByIdAndUpdate(objectSubject._id, { previas: objectSubject.previas }, function (errorUpdateSubject, newObjectSubject) {
                if (errorUpdateSubject)
                    res.json({ errorResult: 'Ocurrió un error y la asignatura no fue actualizada correctamente.' });

                Previa.findByIdAndRemove(request.body.idPrevious, function (errorDeletePrevious, objectDelete) {
                    if (errorDeletePrevious)
                        response.json({ errorResult: "Ocurrió un error y la previa seleccionada no fue borrada completamente. " });

                    response.json({ result: "La asignatura previa fue desvinculada correctamente." });
                })
            })
        })
    })
};

exports.asignatura_nuevoHorario = function (req, res) {

    Asignatura.findById(req.body.idAsig, function (err, asig) {
        if (err) {
            res.json({ data: 'Error la asignatura no existe' });
        }

        var horario = new Horario(
            {
                _id: new mongoose.Types.ObjectId(),
                semestre: req.body.semestre,
                dia: req.body.dia,
                horaDesde: req.body.horaDesde,
                horaHasta: req.body.horaHasta,
                asignatura: asig
            }
        );
        horario.save(function (err) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error' });
            }

            Asignatura.findOneAndUpdate(
                { _id: req.body.idAsig },
                { $push: { horarios: horario } },
                function (error, success) {
                    if (error) {
                        console.log(error);
                        res.json({ data: 'Error asig' });
                    }
                    res.json({ data: 'Horario agregado con éxito' });
                });
        })
    })
};

exports.asignatura_updateHorario = function (req, res) {

    Horario.findByIdAndUpdate(req.body.id, { semestre: req.body.semestre, dia: req.body.dia, horaDesde: req.body.horaDesde, horaHasta: req.body.horaHasta }, function (err, horario) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error al modificar el horario' });
        }
        Horario.findById(req.body.id, function (err, hora) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error el horario no existe' });
            }
            res.json({ data: 'Horario modificado con exito', horario: hora });
        })
    })
};

exports.asignatura_deleteHorario = function (req, res) {

    Horario.findById(req.body.id, function (err, hora) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el horario no existe' });
        }
        Asignatura.findById(hora.asignatura._id, function (err, asig) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error la asignatura no existe' });
            }
            asig.horarios.pull({ _id: hora._id });
            Asignatura.findByIdAndUpdate(asig._id, { horarios: asig.horarios }, function (err, asignatura) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error al eliminar el horario' });
                }
                Horario.findByIdAndRemove(req.body.id, function (err, hdel) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error el horario no existe' });
                    }
                    res.json({ data: 'Horario eliminado con exito' });
                })
            })
        })
    })
};

exports.asignatura_deleteEvaluacion = function (req, res) {

    Evaluacion.findById(req.body.id, function (err, ev) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la evaluacion no existe' });
        }
        Asignatura.findById(ev.asignatura._id, function (err, asig) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error la asignatura no existe' });
            }
            asig.evaluaciones.pull({ _id: ev._id });
            Asignatura.findByIdAndUpdate(asig._id, { evaluaciones: asig.evaluaciones }, function (err, asignatura) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error al eliminar la evaluacion' });
                }
                if (req.body.tipo == "Parcial") {
                    Parcial.findByIdAndRemove(ev.parcial._id, function (err, edel) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error la evaluacion no existe' });
                        }
                    })
                } else if (req.body.tipo == "Examen") {
                    Examen.findByIdAndRemove(ev.examen._id, function (err, edel) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error la evaluacion no existe' });
                        }
                    })
                } else {
                    Laboratorio.findByIdAndRemove(ev.laboratorio._id, function (err, edel) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error la evaluacion no existe' });
                        }
                    })
                }
                Evaluacion.findByIdAndRemove(req.body.id, function (err, edel) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error la evaluacion no existe' });
                    }
                    res.json({ data: 'Evaluacion eliminada con exito' });
                })
            })
        })
    })
};

exports.asignatura_nuevaEvaluacion = function (req, res) {

    Asignatura.findById(req.body.idAsig, function (err, asig) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la asignatura no existe' });
        }
        if (req.body.tipo == "Parcial") {
            var parcial = new Parcial(
                {
                    _id: new mongoose.Types.ObjectId()
                }
            );

            parcial.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error' });
                }

                var evaluacion = new Evaluacion(
                    {
                        _id: new mongoose.Types.ObjectId(),
                        nombre: req.body.nombre,
                        fecha: req.body.fecha,
                        tipo: req.body.tipo,
                        asignatura: asig,
                        parcial: parcial
                    }
                );
                evaluacion.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error ev' });
                    }
                    Asignatura.findOneAndUpdate(
                        { _id: req.body.idAsig },
                        { $push: { evaluaciones: evaluacion } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                res.json({ data: 'Error asig' });
                            }
                            res.json({ data: 'Evaluacion agregada con éxito' });
                        });
                })
            })
        } else if (req.body.tipo == "Examen") {
            var examen = new Examen(
                {
                    _id: new mongoose.Types.ObjectId()
                }
            );

            examen.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error' });
                }

                var evaluacion = new Evaluacion(
                    {
                        _id: new mongoose.Types.ObjectId(),
                        nombre: req.body.nombre,
                        fecha: req.body.fecha,
                        tipo: req.body.tipo,
                        asignatura: asig,
                        examen: examen
                    }
                );
                evaluacion.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error ev' });
                    }
                    Asignatura.findOneAndUpdate(
                        { _id: req.body.idAsig },
                        { $push: { evaluaciones: evaluacion } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                res.json({ data: 'Error asig' });
                            }
                            res.json({ data: 'Evaluacion agregada con éxito' });
                        });
                })
            })
        } else {
            var laboratorio = new Laboratorio(
                {
                    _id: new mongoose.Types.ObjectId(),
                    fechaEntrega: req.body.fechaEntrega,
                    fechaDefensa: req.body.fechaDefensa
                }
            );

            laboratorio.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error' });
                }

                var evaluacion = new Evaluacion(
                    {
                        _id: new mongoose.Types.ObjectId(),
                        nombre: req.body.nombre,
                        fecha: req.body.fecha,
                        tipo: req.body.tipo,
                        asignatura: asig,
                        laboratorio: laboratorio
                    }
                );
                evaluacion.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error ev' });
                    }
                    Asignatura.findOneAndUpdate(
                        { _id: req.body.idAsig },
                        { $push: { evaluaciones: evaluacion } },
                        function (error, success) {
                            if (error) {
                                console.log(error);
                                res.json({ data: 'Error asig' });
                            }
                            res.json({ data: 'Evaluacion agregada con éxito' });
                        });
                })
            })
        }
    })
};

exports.asignatura_detalleEvaluacion = function (req, res) {

    Evaluacion.findById(req.body.id, function (err, ev) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la evaluacion no existe' });
        }
        res.json({ evaluacion: ev });
    })
};

exports.asignatura_listado = function (req, res) {

    Asignatura.find({}, function (err, asigs) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error no hay asignaturas' });
        }
        res.json({ data: asigs });
    });
};

exports.asignatura_update = function (req, res) {

    Asignatura.findByIdAndUpdate(req.body.id, {
        codigo: req.body.codigo, nombre: req.body.nombre, creditos: req.body.creditos,
        programa: req.body.programa, apruebaPor: req.body.apruebaPor, nombreDoc: req.body.nombreDoc,
        correoDoc: req.body.correoDoc, fechaInscripcion: req.body.fechaInscripcion
    }, function (err, asignatura) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error al modificar la asignatura' });
        }
        Asignatura.findById(req.body.id, function (err, asig) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error la asignatura no existe' });
            }
            res.json({ data: 'Asignatura modificada con exito', asignatura: asig });
        })
    })
};

exports.asignatura_details = function (req, res) {

    Asignatura.findById(req.body.id, function (err, asig) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la asignatura no existe' });
        }
        res.json({ asignatura: asig });
    })
};

exports.asignatura_detalleHorario = function (req, res) {

    Horario.findById(req.body.id, function (err, hor) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el horario no existe' });
        }
        res.json({ horario: hor });
    })
};

exports.asignatura_delete = function (req, res) {

    Asignatura.findById(req.body.id, function (err, asig) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la asignatura no existe' });
        }
        for (var i = 0; i < asig.usuarioAsignaturas.length; i++) {
            UsuarioAsignatura.findById(asig.usuarioAsignaturas[i]._id, function (err, uA) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error la asignatura no existe' });
                }
                Usuario.findById(uA.usuario._id, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error el usuario no existe' });
                    }
                    user.usuarioAsignaturas.pull({ _id: uA._id });
                    Usuario.findByIdAndUpdate(user._id, { usuarioAsignaturas: user.usuarioAsignaturas }, function (err, usuario) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error al eliminar la asignatura' });
                        }
                    })
                    UsuarioAsignatura.findByIdAndRemove(uA._id, function (err, uAdel) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error el usuario no existe' });
                        }

                    })
                })
            })
        }
        for (var j = 0; j < asig.horarios.length; j++) {
            Horario.findByIdAndRemove(asig.horarios[j]._id, function (err, h) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error la asignatura no existe' });
                }
            })
        }
        Asignatura.findByIdAndRemove(req.body.id, function (err, uAdele) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error la asignatura no existe' });
            }
            res.json({ data: 'Asignatura eliminada con exito' });
        })
    })
};

//comentario
