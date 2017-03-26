/*
 * API handler test
 */
var express = require("express"),
	router = express.Router(),
	bunyan = require("bunyan"),
	logger = bunyan.createLogger({name: "api"});

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  logger.info("Time: ", Date.now())
  next()
});

// define the home page route
router.get("/", function (req, res) {
  res.send("blank api");
});

module.exports = router;