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
