const expressApp = require('./restApi');
const grpcServer = require('./grpcServer');

const PORT = process.env.PORT || 3000;


expressApp.listen(PORT, () => {
  console.log(`REST API running on port: ${PORT}`);
});

grpcServer.sta();
