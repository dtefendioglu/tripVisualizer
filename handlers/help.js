/*
 * HELP handler test
 */
var express = require('express'),
	router = express.Router(),
	bunyan = require('bunyan'),
	logger = bunyan.createLogger({name: "help"});

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  logger.info('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
  res.send('blank help')
})

// define the about route
router.get('/about', function (req, res) {
  res.send('about page success!')
})

module.exports = router;