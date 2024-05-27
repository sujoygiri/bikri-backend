import express, { Request, Response } from "express";

const HOST: string = "127.0.0.1";
const PORT: number = 3000;

const server = express();

server.get("/", (req: Request, res: Response) => {
  res.send("Hello World from express typescript!");
});

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
