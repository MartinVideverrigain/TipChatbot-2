const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const usuario_controller = require('../controllers/usuario.controller');


// Prueba
router.post('/nuevo', usuario_controller.usuario_nuevo);

router.post('/asignaturaNuevo', usuario_controller.usuarioAsignatura_nuevo);

router.post('/login', usuario_controller.login);

router.post('/listado', usuario_controller.usuario_listado);

router.post('/detalle', usuario_controller.usuario_details);

router.post('/update', usuario_controller.usuario_update);

router.post('/delete', usuario_controller.usuario_delete);

router.post('/updatePassword', usuario_controller.usuario_updatePassword);

router.post('/verify', usuario_controller.usuario_verify);

router.post('/updateUA', usuario_controller.updateUA);

router.post('/listadoUA', usuario_controller.usuario_listadoUA);

router.post('/detalleUA', usuario_controller.usuario_detalleUA);

router.post('/usuarioAsignaturaDelete', usuario_controller.usuarioAsignatura_delete);

router.get('/prueba', usuario_controller.prueba);

module.exports = router;
