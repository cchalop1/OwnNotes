import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { hello, register, login } from './routes.ts'
import { Database } from "https://deno.land/x/denodb/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import authMiddleware from './authMiddleware.ts';
import { Users } from "./models.ts";

const router = new Router();

export const db = new Database('postgres', {
    database: 'own-notes',
    host: 'localhost',
    username: 'test',
    password: 'test',
    port: 5432,
});

db.link([Users]);
// await db.sync({drop: true});

router
    .get("/", authMiddleware, hello)
    .post("/register", register)
    .post("/login", login)
    ;

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
console.log("Server http://localhost:8000/");