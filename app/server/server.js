

require("dotenv").config();
const apis =require('./apis/apiCrud');
const express = require('express')
const app = express();
const bodyParser= require('body-parser');

const port = 3176
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.get('/', (req, res) => {
  res.send('Api ready!')
})
apis.callApis(app);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

