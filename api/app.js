var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const IncomingForm = require('formidable').IncomingForm;

var indexRouter = require('./routes/index');
var runsRouter = require('./routes/runs');

const redis = require('redis');
const client = redis.createClient({prefix: 'creative:'});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(function addDatabase(req, res, next) {
	req.db = client;
	next();
});
app.use(function fileUpload(req, res, next) {
	let form = new IncomingForm();
	form.parse(req, function (err, fields, files) {
		req.fields = fields;
		req.files = files;
		next();
	});
});

app.use('/', indexRouter);
app.use('/api/runs', runsRouter);

module.exports = app;
