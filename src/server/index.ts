import express, {Express, Request, Response} from "express";
import { env } from "../config/env.config";
import { UserRoutes } from "../routers/userRouter";
import { EventRoutes } from "../routers/eventRouter";

export const app:Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "it's working"
    })
});

app.use("/user", UserRoutes);
app.use("/event", EventRoutes);

export default function loadServer() {
    app.listen(env.PORT, () => {
        console.log(`server running at ${env.PORT}`);
        
    })
}