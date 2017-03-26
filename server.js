// modules
var http = require("http"),
	bunyan = require("bunyan"),
	express = require("express"),
	cluster = require("cluster"),
	db = require("./db.js");

var logger = bunyan.createLogger({name: "server"}),
	initSuccess = true;

// config
var config = require("./config.json");
logger.info("config loaded");

// init
db.init(config.db, function(ret) {
	if(ret.code !== 0)
		initSuccess = false;
	else {
		logger.info("db init success!");

		// handlers
		var apiHandler = require("./handlers/api.js");

		// server routing
		if(initSuccess) {
			if(cluster.isMaster) {
				// TODO deal with getting os cores later
				cluster.fork();
			}
			else {
				logger.info("worker %s setting up handlers", cluster.worker.id);

				var app = express();
				
				// static files
				app.use('/', express.static('www'));

				// api handlers
				app.use("/api", apiHandler);

				app.listen(config.server.port);
				logger.info("worker %s now listening on %s", cluster.worker.id, config.server.port);
			}

			cluster.on('exit', function (worker) {
				logger.warn("worker %d has died, forking a new one", worker.id);
			    cluster.fork();
			});
		}
		else
			logger.error("there was an init error, exiting");
	}
});