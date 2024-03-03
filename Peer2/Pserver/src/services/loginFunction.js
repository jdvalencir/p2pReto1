const axios = require("axios"); 
const path = require("path")
require('dotenv').config();

const BASE_URL = process.env.CENTRAL_SERVER_BASE_URL || "http://127.0.0.1:8000";
const SERVER_ADDRESS = process.env.PSERVER_PEER_IP ;
console.log("Im", SERVER_ADDRESS);

const loginFunction =  async (fileIndex) => { 
    try { 
        const result = await axios.post(`${BASE_URL}/api/v1/pserver_login`, {
            "ip_address": SERVER_ADDRESS,
            "file_index": fileIndex
        })
        console.log(result.data);
    } catch (error){
        console.error(`Error al notificar al servidor central: ${error.message}`);
    }
}

module.exports = { loginFunction }