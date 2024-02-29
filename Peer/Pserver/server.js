const express = require("express");
const axios = require("axios");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const app = express();
const port = 3000;
const grpcPort = 50051;

app.use(express.json());

const serverCentralURL = "http://localhost:8000";
let serverId = "";

async function loginServer(){
    try { 
        const response = await axios.post(`${serverCentralURL}/api/v1/login`, {
            "ip_address": "http://localhost:3000",
            "file_index": ["Hola.mp3", "edison.mp3", "hello.mp3"]
        }); 
        serverId = response.data.id
        console.log(response.data);
    } catch (error) {
        console.error("Error al registrar el servidor", error.response?.data || error.message);
    }
}

app.post("/api/v1/logout", async (req, res) => {
    console.log(req);
    const id = req.body.id;
    console.log(id);
    try {
        const response = await axios.post(`${serverCentralURL}/api/v1/logout`, {
            "id": id
        });
        return res.json({ "response": response.data })
    } catch (error) {
        console.error("Error al registrar el servidor", error.response?.data || error.message);
        return res.json( { error } )
    }
})

app.post("/api/v1/download", async (req, res) => {
    const id = req.body.id;
    const fileName = req.body.file_name;
    try {
        const response = await axios.post(`${serverCentralURL}/api/v1/peer_list`, {
            "unique_id": id,
            "file_name": fileName
        });
        console.log(response);
        return res.json({ "response": response.data })
    } catch (error){
        console.error("Error al registrar el servidor", error.response?.data || error.message);
        return res.json( { error } )
    }
}); 

app.post("/api/v1/upload", async (req, res) => {
    const id = req.id;
    const fileName = req.file_name;
    try {
        const response = await axios.post(`${serverCentralURL}/api/v1/upload_peer`, {
            "id": id
        });
        console.log(response);
    } catch (error){
        console.error("Error al registrar el servidor", error.response?.data || error.message);
    }
}); 


app.listen(port, () => {
    console.log(`Server Express escuchando en http://localhost:${port}`);
    loginServer();
})