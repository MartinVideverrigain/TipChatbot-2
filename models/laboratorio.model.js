var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LaboratorioSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	fechaEntrega: {type: Date, required: true},
	fechaDefensa: {type: Date, required: true},
	evaluacion: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Evaluacion'
	}
});

LaboratorioSchema.set('toJSON', {getters: true});

// Export the modelo
module.exports = mongoose.model('Laboratorio', LaboratorioSchema);
