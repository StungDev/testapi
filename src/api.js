//api to send and create keys
const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const getRequests = {};
const postRequests = {};

let keys = [];

//get and create keys
// using supabase

const { createClient } = require('@supabase/supabase-js');
const { query } = require('express');
const supabaseUrl = 'https://doiqfbtwvxcdxfmcbgfn.supabase.co'
const supabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaXFmYnR3dnhjZHhmbWNiZ2ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MDE4NDI4NiwiZXhwIjoxOTg1NzYwMjg2fQ.sfYPXy7nLlfQjD8rdOE1pm94xZW2R3dyLOzisFC12NU')

//get key from supabase
getRequests.key = async function getApiKey(req) {
  const { user } = req.query;
  const { data, error } = await supabase
    .from('keys')
    .select('user, key')
    .eq('user', parseInt(user))
  const { key } = data[0]
  const success = data ? true : false;
  return { key: key, success: success, error: error };
}
//create key in supabase
postRequests.createkey = async function createApiKey(req) {
  const { user } = req.body;
  const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const { data, error } = await supabase
    .from('keys')
    .insert([
      { user: parseInt(user), key: key }
    ])
  const success = error ? false : true;
  return { key: key, success: success, error: error };
}

async function handleApiCall(req, res, requests) {
  const apiname = req.params[0];
  const request = requests[apiname];
  if (request) {
    res.json(await request(req));
  } else {
    res.status(404).send('Not found');
  }
}

router.get('/get/*', (req, res) => {
  handleApiCall(req, res, getRequests);
});
router.post('/post/*', jsonParser, (req, res) => {
  handleApiCall(req, res, postRequests);
});

app.use('/api', router);

module.exports = app;
module.exports.handler = serverless(app);