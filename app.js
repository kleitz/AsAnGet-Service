import dotenv from 'dotenv';
import express from 'express';
import {createServer} from 'https';
import { urlencoded, json } from "body-parser";
import cors from 'cors';
import path from 'path';
import { promisifyAll } from 'bluebird';
import mongoose from 'mongoose';
import cluster from 'cluster';
import fs from 'fs';

import logger from './config/logger';
import authRouter from './auth/route';
import ridesRouter from './rides/route';
import ratingsRouter from './ratings/route';
import locationRouter from './lastlocation/route';
import adminRouter from './admin/route';
import orderRouter from './payment/route';



const enviroment = process.argv[2] || 'development'
dotenv.config({
  path: `${__dirname}/config/.env.${enviroment}`,
  node_env: process.argv[2] || 'development'
});
const PORT = process.env.PORT

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  useUnifiedTopology: true
};

promisifyAll(mongoose);
mongoose.connect(process.env.DB_HOST, dbOptions);


const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/ride',ridesRouter);
app.use('/ratings',ratingsRouter);
app.use('/lastlocation',locationRouter);
app.use('/admin',adminRouter);
app.use('/order',orderRouter);

app.use((err, req, res, next) => {
  logger.saveError(err.stack);
  return res.status(err.status || err.statusCode || 500).send(err.message);
});

const numCPUs = require('os').cpus().length;
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}else {
  const sslServer = createServer({
    key:fs.readFileSync('/root/cert/asanget.com.key'),
    cert:fs.readFileSync('/root/cert/asanget.com.crt')
  },app);
  sslServer.listen(PORT,()=>console.log('ssl server is running on 3002'));
  app.listen(3443, () => {
    console.info(`App listening on port 3443`)
  })
}
