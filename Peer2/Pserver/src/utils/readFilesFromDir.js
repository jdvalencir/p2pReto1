const fs = require("fs");
const path = require("path");
const { loginFunction } = require("../services/loginFunction");

const folderPath = path.join(__dirname, "..", "..", "..", 'files');

const readFolderFile = () => {
     fs.readdir(folderPath, (err, files) => {
        if(err) {
            console.error("Error al leer la carpeta:", err);
            return; 
        }
        const fileList = files.map(file => file);
        console.log("Indice de archivos:", fileList);
        loginFunction(fileList);
        return fileList;
    });
}

module.exports = { readFolderFile }