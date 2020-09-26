import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { me, register, login, newNote, getNotes, getNote } from './routes.ts'
import { Database } from "https://deno.land/x/denodb/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import authMiddleware from './authMiddleware.ts';
import { Users, Note } from "./models.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const SERVER_PORT: number = Number(Deno.env.get("SERVER_PORT")) || 8000;

const router = new Router();

const db = new Database('postgres', {
    database: Deno.env.get("DB_NAME") || "postgres",
    host: Deno.env.get("DB_HOST") || "localhost",
    username: Deno.env.get("DB_USERNAME") || "",
    password: Deno.env.get("DB_USERNAME") || "",
    port: 5432,
});

await db.link([Users, Note]);
// await db.sync();

router
    .post("/me", authMiddleware, me)
    .post("/notes/new", authMiddleware, newNote)
    .post("/notes", authMiddleware, getNotes)
    .get("/notes/:id", authMiddleware, getNote)
    .post("/notes/:id", authMiddleware, getNote)
    // .update("/notes/:id", authMiddleware, getNote)
    .post("/register", register)
    .post("/login", login)
    ;

const app = new Application();

app.use(oakCors(
    {
        origin: "http://localhost:3000"
    }
));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: SERVER_PORT });
console.log(`Server http://localhost:${SERVER_PORT}/`);