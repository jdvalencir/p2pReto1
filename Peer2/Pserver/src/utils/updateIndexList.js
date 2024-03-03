const axios = require("axios");
const path = require("path");
require('dotenv').config();

const BASE_URL = process.env.CENTRAL_SERVER_IP || "http://127.0.0.1:8000";
const SERVER_ADDRESS = process.env.PSERVER_PEER_IP || "0.0.0.0:50051";

const notifyCentralServer = async (fileName) => {
    try { 
        const response = await axios.post(`${BASE_URL}/api/v1/update_list`, {
            "ip_address": SERVER_ADDRESS,
            "file_name": fileName
        }); 
        console.log("Indice de archivo actualizado:", response.data);
    } catch (error) {
        console.error(`Error al notificar al servidor central: ${error.message}`);
    }
}

module.exports = { notifyCentralServer }