const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { monitorFilesFolder } = require("../monitoring/monitorFiles");
const { readFolderFile } = require("../utils/readFilesFromDir");
const { startPeriodicStatusUpdate, sendStatusToCentralServer } = require("../utils/sendPServerStatus")
require('dotenv').config();

const open = util.promisify(fs.open);
const close = util.promisify(fs.close);

const protoPath = path.join(__dirname, "..", "..", "protobuf", "file_transfer.proto");
const protoDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const fileTransfer = grpc.loadPackageDefinition(protoDefinition).fileTransfer;
const server = new grpc.Server();

async function downloadFileHandler(call, callback) {
  callback(null, {
    name: call.request.name,
    message: "Archivo descargado exitosamente",
    success: 1,
  });
}

async function uploadFileHandler(call, callback) {
  const filePath = path.join(__dirname, "..", "..", "..", "files", call.request.name);
  try {
    const fd = await open(filePath, "w");
    await close(fd);
    console.log(`Archivo ${call.request.name} creado exitosamente.`);
    callback(null, { name: call.request.name, message: "Archivo subido exitosamente!", success: 1 });
  } catch (err) {
    console.error('Error al crear el archivo:', err);
    callback(null, { name: call.request.name, message: "Error al subir el archivo.", success: 0 });  }
}

server.addService(fileTransfer.FileTransferService.service, {
  DownloadFile: downloadFileHandler,
  UploadFile: uploadFileHandler
});

function startGRPCServer(){
  const SERVER_ADDRESS = process.env.PSERVER_PEER_IP; 

  server.bindAsync(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Servidor gRPC escuchando en 0.0.0.0:${port}`);
      readFolderFile();
      monitorFilesFolder();
      sendStatusToCentralServer();
      startPeriodicStatusUpdate();
    }
  );
};

module.exports = { startGRPCServer }