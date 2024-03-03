const axios = require("axios");
const { getRndInteger } = require("../utils/randomNumber")
require('dotenv').config();

const PEER_PSERVER_IP = process.env.PSERVER_PEER_IP;

const axiosInstance = axios.create({
    baseURL: process.env.CENTRAL_SERVER_IP
});

function selectRandomIP(data){
    if(data.length === 0) return "";
    return data[getRndInteger(0, data.length)]
}

async function getIPDownload(fileName) { 
    try { 
        const response = await axiosInstance.post("/api/v1/get_ip_list", { 
            "ip_address": PEER_PSERVER_IP, 
            "file_name": fileName
        });
        console.log(response.data);
        return selectRandomIP(response.data);
    } catch (error){ 
        return new Error(error.response ? error.response.data : error.message);
    }
}

async function getIPUpload(){
    try { 
        const response = await axiosInstance.post("/api/v1/upload_round_robin", {  "ip_address": PEER_PSERVER_IP })
        return response.data
    } catch (error) { 
        throw new Error(error.response ? error.response.data : error.message);
    }
}

module.exports = { getIPDownload, getIPUpload }