var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var Request = require("request");
const Usuario = require('../models/usuario.model');
const UsuarioAsignatura = require('../models/usuarioAsignatura.model');
const Asignatura = require('../models/asignatura.model');

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

exports.login = function (req, res) {

    Usuario.findOne({ cedula: req.body.cedula }, (erro, usuarioDB) => {
        if (erro) {
            return res.json({
                ok: false,
                err: erro
            })
        }
        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!usuarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }
        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        bcrypt.compare(req.body.contrasenia, usuarioDB.contrasenia).then(function (result) {
            if (result) {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED_AUTENTICACION, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })
                // res.json({data:'Error no hay usuarios'});
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            } else {
                return res.json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                });
            }
        });
    })
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

exports.usuario_verify = function (req, res) {

    Usuario.findById(req.body.id, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ data: 'Error el usuario no existe' });
        }
        if (user.admin) {
            res.json({ data: true });
        } else {
            res.json({ data: false });
        }
    })
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
