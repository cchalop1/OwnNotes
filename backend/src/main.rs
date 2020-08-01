#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;

mod schema;
mod user;

use rocket::config::{Config, Environment, Value};
use rocket::fairing::AdHoc;
use rocket_contrib::json::Json;
use std::collections::HashMap;
use std::env;
use uuid::Uuid;
use crypto::sha1::*;
use crypto::digest::Digest;

embed_migrations!();

#[database("my_db")]
struct MyDBConn(diesel::PgConnection);

#[derive(Serialize)]
struct HelloMessage {
    message: String,
}

#[derive(Serialize)]
struct Response {
    status: String,
}

#[derive(Deserialize)]
struct NewUser {
    username: String,
    email: String,
    password: String,
}

#[get("/")]
fn index(conn: MyDBConn) -> Json<Vec<user::User>> {
    match user::User::all(&*conn) {
        Ok(res) => Json(res),
        Err(e) => panic!(e),
    }
}

#[post("/register", data = "<new_user>")]
fn create_user(conn: MyDBConn, new_user: Json<NewUser>) -> Json<Response> {
    let mut hasher = Sha1::new();
    hasher.input_str(&new_user.password[..]);
    let user = user::User {
        id: Uuid::new_v4().to_string(),
        username: new_user.username.clone(),
        email: new_user.email.clone(),
        password: hasher.result_str(),
    };

    match user::User::save(&*conn, user) {
        Ok(_) => Json(Response {
            status: format!("ok"),
        }),
        Err(_) => Json(Response {
            status: format!("ko"),
        }),
    }
}

fn get_config() -> Config {
    let mut database_config = HashMap::new();
    let mut databases = HashMap::new();

    let env_address = env::var("ROCKET_ADDRESS")
        .or::<String>(Ok(String::from("localhost")))
        .unwrap();

    let env_mode = env::var("ROCKET_ENV")
        .or(Ok(String::from("development")))
        .and_then(|value| value.parse::<Environment>())
        .unwrap();

    let database_url = match env::var("DATABASE_URL") {
        Ok(value) => value,
        Err(_) => String::from("postgres://test:test@localhost/own-notes"),
    };

    database_config.insert("url", Value::from(database_url));
    databases.insert("my_db", Value::from(database_config));

    Config::build(env_mode)
        .address(env_address)
        .extra("databases", databases)
        .finalize()
        .unwrap()
}

fn run_db_migrations(r: rocket::Rocket) -> Result<rocket::Rocket, rocket::Rocket> {
    let conn = MyDBConn::get_one(&r).expect("database connection");
    match embedded_migrations::run(&*conn) {
        Ok(()) => Ok(r),
        Err(e) => {
            println!("Failed to run database migrations: {:?}", e);
            Err(r)
        }
    }
}

fn main() {
    let config = get_config();
    rocket::custom(config)
        .attach(MyDBConn::fairing())
        .attach(AdHoc::on_attach("Database Migrations", run_db_migrations))
        .mount("/", routes![index, create_user])
        .launch();
}
