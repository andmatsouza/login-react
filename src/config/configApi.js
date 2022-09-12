//import axios from 'axios';
const axios = require('axios').default;


/*export default axios.create({
  baseURL: 'https://enviostelelimp.com.br',
  headers: {'Content-Type': 'application/json'}
});*/

export default axios.create({
  baseURL: 'http://localhost:3001',
  headers: {'Content-Type': 'application/json'}
});


