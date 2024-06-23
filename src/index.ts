import express from "express";
import { join } from "node:path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ path: join(__dirname, '../.env'), debug: true });

import { createRelations, resetDb } from "./util/dbInitialize";
import { authRouter } from "./routes/auth.route";
import { productRouter } from "./routes/product.route";
import { handelError } from "./util/errorHandler";


const HOST: string = "127.0.0.1";
const PORT: number = 3000;

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

server.use('/api/auth/seller', authRouter);
server.use('/api/product', productRouter);

server.get('/reset-db', async (req, res, next) => {
  try {
    let response = await resetDb();
    res.json({ msg: response });
  } catch (error) {
    next(error);
  }
});

server.get('/initialize-db', async (req, res, next) => {
  try {
    let response = await createRelations();
    res.json({ msg: response });
  } catch (error) {
    next(error);
  }
});

server.use(handelError);

server.listen(PORT, HOST, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
