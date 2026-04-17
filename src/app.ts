import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import cors from "cors";

const app: Application = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// better auth
app.all('/api/auth/{*any}', toNodeHandler(auth));


app.get('/', (req, res) => {
  res.send('Hello from Sabrina ^.^')
});



export default app;