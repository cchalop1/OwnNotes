import { Context } from "https://deno.land/x/oak/mod.ts";
import { Users } from "./models.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { hashPassword, generateToken } from "./utils.ts"

export const me = async (ctx: Context) => {
    const body = await ctx.request.body().value;

    if (!body.userId) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    const user = (await Users.where('users').all()).find((user: any) => {
        if (user.id === body.userId)
            return user;
    });
    if (!user) {
        ctx.response.status = 422;
        ctx.response.body = {
            success: false,
            message: 'Invalid uuid'
        };
        return;
    }
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        username: user.username,
        email: user.email
    };
};

export const register = async (ctx: Context) => {
    const body = await ctx.request.body().value;

    if (!body.username || !body.email || !body.password) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    await Users.create({
        id: v4.generate().toString(),
        email: body.email,
        username: body.username,
        password: hashPassword(body.password)
    });
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: "user create"
    }
}

export const login = async (ctx: Context) => {
    const body = await ctx.request.body().value;

    if (!body.email || !body.password) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    const user = (await Users.where('users').all()).find((user: any) => {
        if (user.email === body.email && user.password === hashPassword(body.password))
            return user;
    });
    if (!user) {
        ctx.response.status = 422;
        ctx.response.body = {
            success: false,
            message: 'Invalid username or password'
        };
        return;
    }
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        userId: user.id,
        jwt: generateToken(user)
    }
}