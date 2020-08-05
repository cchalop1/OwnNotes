import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';

export class Users extends Model {
    static table = 'users';
    static fields = {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    };
}

export class Note extends Model {
    static table = 'note';
    static timestamps = true;
    static fields = {
        id: {
            type: DataTypes.STRING
        },
        userId: DataTypes.STRING,
        title: DataTypes.STRING,
        content: DataTypes.STRING
    };
}
