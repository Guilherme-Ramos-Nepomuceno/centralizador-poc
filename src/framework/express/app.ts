import "reflect-metadata";
import express, { json, Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*", optionsSuccessStatus: 200, }));

app.use((req: Request, res: Response, next: () => void) => {
    if (Buffer.isBuffer(req.body)) {
        try { req.body = JSON.parse(req.body.toString()); }
        catch (e) {
            console.error('Failed to parse body as JSON', e);
        }
    }
    next();
});

app.use(json({ limit: "50mb" }));



export { app };