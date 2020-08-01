#![allow(proc_macro_derive_resolution_fallback)]

use super::schema::users;
use diesel;
use diesel::prelude::*;

#[derive(Queryable, AsChangeset, Serialize, Deserialize, Insertable, Debug)]
#[table_name = "users"]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub password: String,
}

impl User {
    pub fn all(connection: &PgConnection) -> QueryResult<Vec<User>> {
        users::table.load::<User>(&*connection)
    }

    pub fn save(connection: &PgConnection, user: User) -> QueryResult<usize> {
        diesel::insert_into(users::table)
            .values(user)
            .execute(connection)
    }
}
