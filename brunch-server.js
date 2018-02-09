//A simple node server with a catch all that lets you refresh from any page
//Brunch is configured to use this as the dev server.


var deployConfig = require('./deployConfig')

const express = require('express')

const app = express();

app.use(function logRequest (req, res, next) {
  console.log(`${req.method}: ${req.originalUrl}`);
  next()
});

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/public')

app.use(deployConfig.baseUrl, express.static(__dirname + '/public'));

app.get('*', (req, res, next) => {
  console.log('catchAll');
  res.render('index.html');
})


module.exports = (config, callback) => {
  app.listen(config.port, function () {
    console.log(`========== Server listening on localhost:${config.port}${deployConfig.baseUrl} ==========`)
    callback()
  });

  return app
}