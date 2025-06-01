import {Elysia} from "elysia";
import {auth} from "./controllers/auth";
import swagger from "@elysiajs/swagger";
import {swaggerConfig} from "./swagger";


const app = new Elysia()
    .use(swagger(swaggerConfig))
    .use(auth)
    .listen(5454);

export type App = typeof app