import { app } from "./app"
import dotenv from "dotenv";
import { getPgVersion } from "./db";

dotenv.config()

getPgVersion()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("server is running on port", process.env.PORT)
        })
    })
    .catch((err: any) => {
        console.log('failed to connect with server', err)
    })