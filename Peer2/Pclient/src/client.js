const prompt = require("prompt-sync")({ sigint: true });
const { getIPDownload, getIPUpload } = require("./services/httpService");
const { downloadFile, uploadFile } = require("./services/grpcService");

async function performDownload(fileName) {
    try {
        const ip = await getIPDownload(fileName);
        if (ip === "") {
            console.error("Ningún PServer tiene ese archivo.");
            return;
        }
        downloadFile(fileName, ip);
    } catch (error) {
        console.error("Error al obtener la IP para descarga:", error.message);
    }
}

async function performUpload(fileName) {
    try {
        const ip = await getIPUpload();
        if (ip === "") {
            console.error("No hay PServer para subir el archivo.");
            return;
        }
        uploadFile(fileName, ip);
    } catch (error) {
        console.error("Error al obtener la IP para subida:", error.message);
    }
}

const main = async () => {
    const option = prompt("1) Download file - 2) Upload file: ");
    const fileName = prompt("Ingresa el nombre del archivo: ");

    if (!fileName) {
        console.error("No ingresaste un nombre de archivo válido.");
        return;
    }

    switch (option) {
        case "1":
            await performDownload(fileName);
            break;
        case "2":
            await performUpload(fileName);
            break;
        default:
            console.log("Opción no válida.");
    }
}

main();