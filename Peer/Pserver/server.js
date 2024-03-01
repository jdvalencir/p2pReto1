import app from './app.js';
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("A&B Core Service in running on port: " + PORT)
});
