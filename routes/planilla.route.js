const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const planilla_controller = require('../controllers/planilla.controller');

router.post('/prueba', planilla_controller.prueba_excel);

router.post('/prueba2', planilla_controller.prueba_excel2);

router.post('/alta', planilla_controller.alta_excel);

router.get('/download', planilla_controller.download_excel);

router.post('/upload', planilla_controller.upload_excel);

module.exports = router;
