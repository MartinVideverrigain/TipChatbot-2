var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioAsignaturaSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	estado: {type:String, enum: ['Cursando','Exámen','Exonerada']},
	usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Usuario'
	},
	asignatura: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Asignatura'
	}
});

UsuarioAsignaturaSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('UsuarioAsignatura', UsuarioAsignaturaSchema);
