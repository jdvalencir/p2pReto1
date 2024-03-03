const path = require("path");
const fs = require("fs");
const { notifyCentralServer } = require("../utils/updateIndexList")

const filesDir = path.join(__dirname, "..", "..", "..", 'files');

const monitorFilesFolder = () => {
    fs.watch(filesDir, async (eventType, filename) => {
        if (eventType === 'rename') {
            const filePath = path.join(filesDir, filename);
            try { 
                fs.access(filePath, fs.constants.F_OK, async (err) => {
                    if(!err){
                        console.log(`Nuevo archivo detectado: ${filename}`);  
                        await notifyCentralServer(filename); 
                    }
                });
            }  catch (err){ 
                if(err.code === "ENOENT") console.log(`Archivo eliminado: ${filename}`);
                else console.error(`Error al acceder al archivo: ${filename}`, err);
            }
        }
    });
}


module.exports = { monitorFilesFolder }