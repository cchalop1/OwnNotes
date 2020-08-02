import { Context } from "https://deno.land/x/oak/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import key from './key.ts'

const authMiddleware = async (ctx: Context, next: any) => {
    const headers: Headers = ctx.request.headers;
    const jwt = headers.get('Authorization');

    if (!jwt) {
        ctx.response.status = 401;
        return;
    }
    if (await (await validateJwt(jwt, key)).isValid) {
        await next();
        return;
    }
    ctx.response.status = 401;
    ctx.response.body = { message: 'Invalid jwt token' };
}

export default authMiddleware;