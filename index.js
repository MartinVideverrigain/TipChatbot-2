const express = require('express');
const bodyParser = require('body-parser');
const pregunta = require('./routes/pregunta.route');
const feriado = require('./routes/feriado.route');
const usuario = require('./routes/usuario.route');
const asignatura = require('./routes/asignatura.route');
const planilla = require('./routes/planilla.route');
const historial = require('./routes/historial.route');

var cors = require('cors')

// Importar las rutas de los productos
const app = express();

// Conexion a mongo
var mongoose = require('mongoose');
//var dev_db_url = 'mongodb://localhost:27017/tipchatbot?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false';
var dev_db_url = 'mongodb+srv://tipbot:tipchatpablot@cluster0.b23cn.mongodb.net/tipchatbot?retryWrites=true&w=majority';
var mongoDB = dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', ()=> {
    console.log('connected')
})
process.env.URLDB = mongoDB;
process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION ||  'este-es-el-seed-desarrollo';

app.use(cors({origin:true,credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/preguntas', pregunta);
app.use('/feriados', feriado);
app.use('/usuario', usuario);
app.use('/asignaturas', asignatura);
app.use('/planillas', planilla);
app.use('/historial', historial);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Chatbot BackEnd up!');
});
