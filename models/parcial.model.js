var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParcialSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	evaluacion: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Evaluacion'
	}
});

ParcialSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Parcial', ParcialSchema);
