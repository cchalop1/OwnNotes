import { Context } from "https://deno.land/x/oak/mod.ts";
import { Users, Note } from "./models.ts";
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


export const newNote = async (ctx: Context) => {
    const body = await ctx.request.body().value;

    if (!body.userId || !body.title || !body.content) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    const res = await Note.create({
        id: v4.generate().toString(),
        userId: body.userId,
        title: body.title,
        content: body.content
    });
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: res
    }
}

export const updateNote = async (ctx: Context) => {
    const body = await ctx.request.body().value;

}


export const deleteNote = async (ctx: Context) => {
    const body = await ctx.request.body().value;

}


export const getNotes = async (ctx: Context) => {
    const body = await ctx.request.body().value;

    if (!body.userId) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    const res = (await Note.all()).filter((n: any) => n.userId == body.userId);
    if (res.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = {
            success: false,
            message: "not notes avalable",
            notes: null
        }
        return;
    }
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: "notes fetch corectly",
        notes: res
    }
}


export const getNote = async (ctx: Context) => {
    const body = await ctx.request;
    const noteId = await body.url.pathname.split("/")[2];

    if (!noteId) {
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "bad request"
        }
        return;
    }
    const res = (await Note.all()).find((note: any) => note.id === noteId);
    if (!res) {
        ctx.response.status = 404;
        ctx.response.body = {
            success: false,
            message: "not note avalable",
            notes: null
        }
    }
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        notes: res
    }
}