// src/services/api.js

import axios from 'axios';


const api = axios.create({
  withCredentials: true
});



export default api;
