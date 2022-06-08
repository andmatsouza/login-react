//import axios from 'axios';
const axios = require('axios').default;


export default axios.create({
  baseURL: 'http://localhost:8080',
  headers: {'Content-Type': 'application/json'}
});