//A simple node server with a catch all that lets you refresh from any page
//Brunch is configured to use this as the dev server.


var deployConfig = require('./deployConfig')

const express = require('express')

const app = express();

const Fuse = require('fuse.js')
const bodyParser = require('body-parser');


let cache = {}


app.use(function logRequest (req, res, next) {
  console.log(`${req.method}: ${req.originalUrl}`);
  next()
});

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/public')

app.use(deployConfig.baseUrl, express.static(__dirname + '/public'));

app.use(bodyParser({limit: '50mb'}))

app.route('/participationreports/testSearch')
  .post(bodyParser.json(), (req, res) => {

    const {data, searchingFor} = req.body

    const cacheResult = cache[searchingFor]

    if(searchingFor.length === 1) {
      cache = {}
      cache[searchingFor] = cacheResult
    }

    if(cacheResult) {
      res.send(cacheResult)
      return
    }

    const engine = new Fuse(data, {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.4
    })

    const searchResult = engine.search(searchingFor)

    cache[searchingFor] = {data: searchResult, searchingFor}

    res.send({data: searchResult, searchingFor: searchingFor})
  })


app.get('*', (req, res, next) => {
  res.render('index.html');
})


module.exports = (config, callback) => {
  app.listen(config.port, function () {
    console.log(`========== Server listening on localhost:${config.port}${deployConfig.baseUrl} ==========`)
    callback()
  });

  return app
}