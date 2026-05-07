import express, { Application } from "express";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import httpLogger from "./config/httpLogger.config";

const app: Application = express();

app.use(httpLogger)
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

export default app;
