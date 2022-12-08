const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const getRequests = {};
const postRequests = {};

async function getKey(req) {
  const { id } = req.params;
  return id;
}

async function callApi(req, res, requests, query) {
  const { id } = req.params;
  const request = requests[id];
  if (request) {
    res.json(request);
  } else {
    res.status(404).send('Not found');
  }
}
  

router.post('/post', jsonParser, (req, res) => {
  // callApi(req, res, getRequests, req.query);
  // console.log(req)

  res.json({body: req.body})
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);