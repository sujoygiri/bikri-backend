import express from "express";
import { join } from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: join(__dirname, '../.env'), debug: true });

import { createRelations } from "./util/dbInitialize";
import { authRouter } from "./routes/auth.route";


const HOST: string = "127.0.0.1";
const PORT: number = 3000;

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use('/api/auth/seller', authRouter);

server.listen(PORT, HOST, async () => {
  try {
    await createRelations();
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
