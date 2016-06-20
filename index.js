const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router');
const config = require('./config');
const app = express();

// DB Setup
mongoose.connect(config.mongodb_link);

// App Setup
app.use(express.static('./public'));
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*'}));

router(app);


// Server Setup
const port = process.env.PORT || 1459;
const server = http.createServer(app);
server.listen(port, function(){
  console.log('server is listening on PORT::'+port);
});
