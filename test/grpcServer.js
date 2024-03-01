// grpcServer.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Definición del servicio gRPC en línea para simplificar el ejemplo
const protoDefinition = protoLoader.loadSync(
  './hello.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const helloProto = grpc.loadPackageDefinition(protoDefinition).helloworld;

const server = new grpc.Server();

// Implementa el servicio gRPC
server.addService(helloProto.Greeter.service, {
  sayHello: (call, callback) => {
    callback(null, { message: 'Hola Mundo desde gRPC!' });
  }
});

function start() {
  console.log("hola")
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(error);
      return;
    }
    server.start();
    console.log(`Servidor gRPC escuchando en 0.0.0.0:${port}`);
  });
}

module.exports = { start };
