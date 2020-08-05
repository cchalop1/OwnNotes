import { createHash } from "https://deno.land/std/hash/mod.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import key from './key.ts';

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
}

export const generateToken = (user: any) => {
    const payload: Payload = {
        iss: user.id,
        exp: setExpiration(new Date().getTime() + 600000),
    };
    return makeJwt({ key, header, payload });
}

export const hashPassword = (password: string) => {
    const hash = createHash("sha256");
    hash.update(password);
    return hash.toString();
}