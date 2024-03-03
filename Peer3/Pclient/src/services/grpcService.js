const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require("path"); 
const fs = require("fs");
const util = require("util")

const open = util.promisify(fs.open);
const close = util.promisify(fs.close);

const protoPath = path.join(__dirname, "..", "..", "protobuf", "file_transfer.proto");
const protoDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true    
});

const fileTransfer = grpc.loadPackageDefinition(protoDefinition).fileTransfer;

const createClient = (ipAddress) => {
    return new fileTransfer.FileTransferService(ipAddress, grpc.credentials.createInsecure());
};

const downloadFile = (fileName, ipAddress) => { 
    const client = createClient(ipAddress);
    client.DownloadFile({ "name": fileName }, async (err, data) => {
        if(err) throw err
        if(data.success){
            const filePath = path.join(__dirname, "..", "..", "..", "files", data.name);
            try { 
                const fd = await open(filePath, "w");
                await close(fd);
                console.log(data.name, data.message);
            } catch(err){
                throw err;
            }
        }
    });
}

const uploadFile = (fileName, ipAddress) => { 
    const client = createClient(ipAddress);
    client.UploadFile({ "name": fileName }, (err, data) => {
        if(err) throw err;
        console.log(data);
    })
} 

module.exports = { downloadFile, uploadFile }