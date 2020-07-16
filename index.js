require('dotenv').config();

const server = require('./server.js');

const port = process.env.port;

server.listen(port, () => {
  console.log('***** server running on http://localhost:4000 *****');
});
