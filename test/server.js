const expressApp = require('./restApi');
const grpcServer = require('./grpcServer');

const PORT = process.env.PORT || 3000;

grpcServer.start();

expressApp.listen(PORT, () => {
  console.log(`REST API running on port: ${PORT}`);
});
