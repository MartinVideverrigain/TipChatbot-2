var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EvaluacionSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	nombre: {type: String, required: true, max: 200},
	fecha: {type: Date, required: true},
	tipo: {type: String, enum: ['Parcial','Examen','Laboratorio']},
	asignatura: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Asignatura'
	},
	parcial: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Parcial'
	},
	examen: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Examen'
	},
	laboratorio: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Laboratorio'
	}
});

EvaluacionSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Evaluacion', EvaluacionSchema);
