const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CENTRAL_SERVER_IP || "http://127.0.0.1:8000";
const SERVER_ADDRESS = process.env.PSERVER_PEER_IP || "0.0.0.0:50051";

async function sendStatusToCentralServer(){ 
    try { 
        const response = await axios.post(`${BASE_URL}/api/v1/check_peers_status`, {
            "ip_address": SERVER_ADDRESS
        }); 
        console.log(response.data);
        } catch(error){ 
        console.error('Error al enviar estado:', error.response ? error.response.data : error.message);
    }
};


function startPeriodicStatusUpdate(){
    const CHECK_IN_INTERVAL = 8000;
    setInterval(sendStatusToCentralServer, CHECK_IN_INTERVAL);
}

module.exports = { startPeriodicStatusUpdate, sendStatusToCentralServer } 
