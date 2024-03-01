import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoutes from './routes/auth.routes.js';

dotenv.config();
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());


// Routes

app.use('/api/v1/auth', AuthRoutes);

app.get('/', (req, res) => {
  res.status(200).send('PServer is up and running');
});


export default app;