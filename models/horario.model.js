var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorarioSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	semestre: {type:String, enum: ['1','2','3','4','5','6']},
	dia: {type:String, enum: ['Lunes','Martes','Miércoles','Jueves','Viernes']},
	horaDesde: {type: String, required: true, max: 200},
	horaHasta: {type: String, required: true, max: 200},
	asignatura: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Asignatura'
	}
});

HorarioSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Horario', HorarioSchema);
