var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Request = require("request");
const Usuario = require('../models/usuario.model');
const UsuarioAsignatura = require('../models/usuarioAsignatura.model');
const Asignatura = require('../models/asignatura.model');
const Previa = require('../models/previa.model');

exports.addAdminUser = function (request, response) {
    if (request.body.idUser != request.body.currentUser) {
        Usuario.findById(request.body.currentUser, function (errorQueryGetAdmin, objectUserAdmin) {
            if (errorQueryGetAdmin)
                response.json({ errorResult: "No fue encontrado el usuario en sesión dentor de la base de datos." });
            if (objectUserAdmin.cedula == "11111111") {

                Usuario.findByIdAndUpdate(request.body.idUser, { admin: request.body.newAdminValue }, function (errorQueryChangeAdmin, objectNewAdmin) {
                    if (errorQueryChangeAdmin)
                        response.json({ errorResult: 'Ocurrió un error, los permisos del usuario seleccionado no fueron modificados.' });


                    response.json({ result: 'Los permisos del usuario seleccionado fueron modificados correctamente.', objectResult: objectNewAdmin });
                })
            } else response.json({ errorResult: "Solo el usuario principal puede dar privilegios de administrador." });
        });
    } else response.json({ errorResult: "No puede modificar sus propios privilegios." });
}

exports.usuario_nuevo = function (req, res) {

    Usuario.findOne({ cedula: req.body.cedula }, (erro, usuarioDB) => {
        if (!usuarioDB) {
            var usuario = new Usuario(
                {
                    _id: new mongoose.Types.ObjectId(),
                    cedula: req.body.cedula,
                    nombre: req.body.nombre,
                    contrasenia: bcrypt.hashSync(req.body.contrasenia, 10),
                    apellido: req.body.apellido,
                    admin: req.body.admin
                }
            );

            usuario.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error' });
                }
                res.json({ data: 'Usuario agregado con éxito' });

            })
        } else {
            res.json({ data: 'La cédula ya ha sido registrada' });
        }
    })
};

exports.usuarioAsignatura_nuevo = function (req, res) {

    Usuario.findById(req.body.idUser, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }

        Asignatura.findById(req.body.idAsig, function (err, asig) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error la asignatura no existe' });
            }

            UsuarioAsignatura.find({ $and: [{ usuario: req.body.idUser }, { asignatura: req.body.idAsig }] }, function (err, usAsDB) {


                if (usAsDB[0] == undefined) {
                    var usuarioAsignatura = new UsuarioAsignatura(
                        {
                            _id: new mongoose.Types.ObjectId(),
                            estado: req.body.estado,
                            usuario: user,
                            asignatura: asig
                        }
                    );

                    usuarioAsignatura.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error' });
                        }

                        Usuario.findOneAndUpdate(
                            { _id: req.body.idUser },
                            { $push: { usuarioAsignaturas: usuarioAsignatura } },
                            function (error, success) {
                                if (error) {
                                    console.log(error);
                                    res.json({ data: 'Error user' });
                                }

                                Asignatura.findOneAndUpdate(
                                    { _id: req.body.idAsig },
                                    { $push: { usuarioAsignaturas: usuarioAsignatura } },
                                    function (error, success) {
                                        if (error) {
                                            console.log(error);
                                            res.json({ data: 'Error asig' });
                                        }
                                        res.json({ data: 'usuarioAsignatura agregado con éxito' });
                                    });
                            });
                    })

                } else {
                    res.json({ data: 'Ya te has registrado a esta asignatura' });
                }

            })

        })
    })
};

exports.login = function (request, response) {

    Usuario.findOne({ cedula: request.body.cedula }, function (errorQueryGetUser, objectUser) {
        if (errorQueryGetUser)
            response.json({
                ok: false,
                err: errorQueryGetUser
            });

        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!objectUser)
            response.json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        bcrypt.compare(request.body.contrasenia, objectUser.contrasenia).then(function (resultCompare) {
            if (resultCompare) {
                let token = jwt.sign({
                    usuario: objectUser,
                }, process.env.SEED_AUTENTICACION, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })
                response.json({
                    ok: true,
                    usuario: objectUser,
                    token,
                });
            } else {
                return response.json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                });
            }
        });
    });
};

exports.usuario_listado = function (req, res) {

    Usuario.find({}, function (err, users) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error no hay usuarios' });
        }
        res.json({ data: users });
    });
};

exports.usuario_update = function (req, res) {

    Usuario.findByIdAndUpdate(req.body.id, { cedula: req.body.cedula, nombre: req.body.nombre, apellido: req.body.apellido }, function (err, usuario) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error al modificar el usuario' });
        }
        Usuario.findById(req.body.id, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error el usuario no existe' });
            }
            res.json({ data: 'Usuario modificado con exito', usuario: user });
        })
    })
};

exports.usuario_details = function (req, res) {

    Usuario.findById(req.body.id, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        res.json({ usuario: user });
    })
};

exports.usuario_updatePassword = function (req, res) {

    Usuario.findById(req.body.id, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        bcrypt.compare(req.body.actual, user.contrasenia).then(function (result) {
            if (result) {
                Usuario.findByIdAndUpdate(req.body.id, { contrasenia: bcrypt.hashSync(req.body.contrasenia, 10) }, function (err, usuario) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error al modificar la contraseña' });
                    } else {
                        res.json({ data: 'Contraseña actualizada con exito' });
                    }
                })
            } else {
                res.json({ data: 'La contraseña actual es incorrecta' });
            }
        });
    })
};

exports.usuario_verify = function (request, response) {

    Usuario.findById(request.body.id, function (errorQuery, objectUser) {
        if (errorQuery)
            response.json({ data: 'Error el usuario no existe' });

        if (objectUser.admin)
            response.json({ data: true });
        else
            response.json({ data: false });
    });
};

exports.usuario_delete = function (req, res) {

    Usuario.findById(req.body.id, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        for (var i = 0; i < user.usuarioAsignaturas.length; i++) {
            UsuarioAsignatura.findById(user.usuarioAsignaturas[i]._id, function (err, uA) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error el usuario no existe' });
                }
                Asignatura.findById(uA.asignatura._id, function (err, asig) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error el usuario no existe' });
                    }
                    asig.usuarioAsignaturas.pull({ _id: uA._id });
                    Asignatura.findByIdAndUpdate(asig._id, { usuarioAsignaturas: asig.usuarioAsignaturas }, function (err, asignatura) {
                        if (err) {
                            console.log(err);
                            res.json({ data: 'Error al eliminar el usuario' });
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

        Usuario.findByIdAndRemove(req.body.id, function (err, uAdel) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error el usuario no existe' });
            }
            res.json({ data: 'Usuario eliminado con exito' });
        })

    })
};

exports.updateUA = function (req, res) {

    UsuarioAsignatura.findByIdAndUpdate(req.body.id, { estado: req.body.estado }, function (err, uA) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        UsuarioAsignatura.findById(req.body.id, function (err, uAs) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error el usuario no existe' });
            }
            res.json({ data: 'Modificado con exito', uA: uAs });
        })
    })
};

exports.usuario_listadoUA = function (req, res) {

    UsuarioAsignatura.find({}, function (err, usersA) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error no hay usuarios' });
        }
        res.json({ data: usersA });
    });
};

exports.usuario_detalleUA = function (req, res) {

    UsuarioAsignatura.findById(req.body.id, function (err, userA) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        res.json({ usuarioAsignatura: userA });
    })
};
exports.prueba = function (req, res) {
    res.json({ prueba: 'esto es una prueba' });
};

exports.usuarioAsignatura_delete = function (req, res) {

    UsuarioAsignatura.findById(req.body.id, function (err, uA) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error la asignatura no existe' });
        }
        Usuario.findById(uA.usuario._id, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ data: 'Error el usuario no existe' });
            }
            Asignatura.findById(uA.asignatura._id, function (err, asig) {
                if (err) {
                    console.log(err);
                    res.json({ data: 'Error el usuario no existe' });
                }
                user.usuarioAsignaturas.pull({ _id: uA._id });
                Usuario.findByIdAndUpdate(user._id, { usuarioAsignaturas: user.usuarioAsignaturas }, function (err, usuario) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error al eliminar U' });
                    }
                })
                asig.usuarioAsignaturas.pull({ _id: uA._id });
                Asignatura.findByIdAndUpdate(asig._id, { usuarioAsignaturas: asig.usuarioAsignaturas }, function (err, asignatura) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error al eliminar A' });
                    }
                })
                UsuarioAsignatura.findByIdAndRemove(uA._id, function (err, uAdel) {
                    if (err) {
                        console.log(err);
                        res.json({ data: 'Error el usuarioA no existe' });
                    }
                    res.json({ data: 'Eliminado con exito' });
                })
            })
        })
    })
};


//esta función te devuelve el objeto usuario buscando a partir de la cedula
exports.usuario_details_cedula = function (req, res) {
    console.log(req.body.cedula);
    Usuario.findOne({ cedula: req.body.cedula }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        //console.log(user);
        res.json({ usuario: user });
    });
};

//esta función te devuelve el objeto usuario buscando a partir del id de telegram
exports.usuario_details_telegram = function (req, res) {
    console.log("usuario_details_telegram: " + req.body.id_telegram);
    Usuario.findOne({ id_telegram: req.body.id_telegram }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no se encontró' });
        }
        console.log("usuario_details_telegram: " + user);
        res.json({ usuario: user });
    });
}

//esta funcion te devuelve las materias previas que tenes que aporbar antes de poder cursar otra
exports.asignaturasPendientes = async function (req, res) {

    //en asig se guarda el obj asignatura que es igual al codigo que llega
    Asignatura.findOne({ codigo: req.body.codigo }, async function (erro, asig) {
        if (erro) {
            console.log(erro);
            res.json({ Reply: 'Error la asignatura no existe' });
        }
        var resultado = [];
        //en previa recorro los id de las asignaturas previas que tiene asig
        for (const previa of asig.previas) {
            var myPromise = () => {
                return new Promise((resolve, reject) => {
                    //asigP es el objeto Previa 
                    Previa.findById(previa._id).populate('asignatura').exec(function (err, asigP) {
                        if (err) {
                            console.log(err);
                            res.json({ Reply: 'Error la asignatura no existe' });
                        }
                        //
                        UsuarioAsignatura.find({ $and: [{ usuario: req.body.id }, { estado: "Exonerada" }] }).populate('asignatura').exec(function (err, uA) {
                            if (err) {
                                console.log(err);
                                res.json({ Reply: 'Error el usuario no existe' });
                            }
                            uA.find(function (item) {
                                if (String(item.asignatura._id) == String(asigP.asignatura._id)) {
                                    resolve("Tiene exonerada la asignatura " + asigP.asignatura.nombre);
                                }
                            });
                            resolve("No tiene exonerada la asignatura " + asigP.asignatura.nombre);
                        })
                    })
                });
            };
            resultado.push(await myPromise());
        }
        res.json({ Reply: resultado });
    })
};


exports.verificarUsuarioTelegram = async function (req, res) {

    if (req.body.frontend) {//solamente se modifica el campo activo
        Usuario.findByIdAndUpdate(
            req.body.id,
            { $set: { activo_telegram: req.body.activo_telegram } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.json({ ok: false, err: 'Error al guardar los datos de telegram' });
                }
                else {
                    res.json({ ok: true });
                }
            }
        )
    }
    else {       //esto sería si viene desde el interprete, entonces se modifican los dos valores
        Usuario.findByIdAndUpdate(
            req.body.id,
            { $set: { id_telegram: req.body.id_telegram, activo_telegram: req.body.activo_telegram } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.json({ ok: false, err: 'Error al guardar los datos de telegram' });
                }
                else {
                    res.json({ ok: true });
                }
            }
        )
    }

}
