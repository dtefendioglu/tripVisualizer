// modules
var http = require('http'),
	bunyan = require('bunyan'),
	express = require('express'),
	cluster = require('cluster'),
	db = require('./db.js');

var logger = bunyan.createLogger({name: "server"}),
	initSuccess = true;

// config
var config = require('./config.json');
logger.info("config loaded");

// db init
db.init(config.db, function(ret) {
	if(ret.code !== 0)
		initSuccess = false;
	else
		logger.info("db init success!");
});

// handlers
var helpHandler = require('./handlers/help.js');

// server routing
if(initSuccess) {
	if(cluster.isMaster) {
		// TODO deal with getting os cores later
		cluster.fork();
	}
	else {
		var app = express();
		app.get("/", function(req, res, next) {
			res.send("blank page");
		});

		logger.info("setting up handlers");
		app.use("/help", helpHandler);

		logger.info("listening on %s", config.server.port);
		app.listen(config.server.port);
	}
}
else
	logger.error("there was an init error, exiting");