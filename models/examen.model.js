var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExamenSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	evaluacion: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Evaluacion'
	}
});

ExamenSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Examen', ExamenSchema);
