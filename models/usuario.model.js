var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	cedula:{type:String,validate:[
			function(cedula){
					return cedula.length == 8;
			},'La cédula debe contener 8 caracteres']},
	nombre: {type: String, required: true, max: 200},
	apellido: {type: String, required: true, max: 200},
	contrasenia: {type: String, required: true, min: 6, max:50},
	admin: {type: Boolean, required: true},
	usuarioAsignaturas:[
			{
					 type: Schema.Types.ObjectId,
					 ref: "UsuarioAsignatura"
			}
	],
	historialChat:[
		{
			type: Schema.Types.ObjectId,
			ref: "HistoriaChat"
		}
	]
});

UsuarioSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('Usuario', UsuarioSchema);
