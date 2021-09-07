const express = require('express');
const router = express.Router();

const historial_controller = require('../controllers/historial.controller');

router.post('/insertUserHistory', historial_controller.historial_nuevo);

router.post('/getUserHistory', historial_controller.get_historial);

router.post('/getCountQuestionByDate', historial_controller.getCountQuestionByDate);

router.post('/getCountQuestionsByUser', historial_controller.getCountQuestionsByUser);

router.post('/getCountSubjectConsult', historial_controller.getCountSubjectConsult);

router.post('/getConsultsBySubject', historial_controller.getConsultsBySubject);

module.exports = router;