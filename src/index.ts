import express from "express";
import { join } from "node:path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ path: join(__dirname, '../.env'), debug: true });

import { createRelations, resetDb } from "./util/dbInitialize";
import { authRouter } from "./routes/auth.route";


const HOST: string = "127.0.0.1";
const PORT: number = 3000;

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());

server.use('/api/auth/seller', authRouter);

server.get('/reset-db', async (req, res, next) => {
  let response = await resetDb();
  res.json({ msg: response });
});

server.get('/initialize-db', async (req, res, next) => {
  let response = await createRelations();
  res.json({ msg: response });
});

server.listen(PORT, HOST, async () => {
  try {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
