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

extern crate jsonwebtoken as jwt;
extern crate rustc_serialize;
use jwt::{decode, encode, DecodingKey, EncodingKey, Header, Validation};

mod schema;
mod user;

use crypto::digest::Digest;
use crypto::sha1::*;
use rocket::config::{Config, Environment, Value};
use rocket::fairing::AdHoc;
use rocket::http::{Cookie, Cookies};
use rocket_contrib::json::Json;
use std::collections::HashMap;
use std::env;
use uuid::Uuid;

static KEY: &'static [u8; 16] = include_bytes!("../secret.key");
static ONE_WEEK: i64 = 60 * 60 * 24 * 7;

embed_migrations!();

#[database("my_db")]
struct MyDBConn(diesel::PgConnection);

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

#[derive(Deserialize)]
struct LoginUser {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct ResponseLogin {
    success: bool,
    uuid: String,
    jwt: String,
}

#[derive(Serialize)]
struct ResponseMe {
    success: bool,
    username: String,
}

#[derive(Debug, RustcEncodable, RustcDecodable, Serialize, Deserialize)]
struct UserToken {
    iat: i64,
    exp: i64,
    user_id: String,
}

fn jwt_generate(user_id: String) -> String {
    let now = time::get_time().sec;
    let payload = UserToken {
        iat: now,
        exp: now + ONE_WEEK,
        user_id: user_id,
    };
    encode(
        &Header::default(),
        &payload,
        &EncodingKey::from_secret(KEY.as_ref()),
    )
    .unwrap()
}

#[get("/")]
fn index(conn: MyDBConn) -> Json<Vec<user::User>> {
    match user::User::all(&*conn) {
        Ok(res) => Json(res),
        Err(e) => panic!(e),
    }
}

#[post("/register", data = "<new_user>")]
fn register(conn: MyDBConn, new_user: Json<NewUser>) -> Json<Response> {
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

#[post("/login", data = "<login_user>")]
fn login(mut cookies: Cookies, conn: MyDBConn, login_user: Json<LoginUser>) -> Json<ResponseLogin> {
    let mut hasher = Sha1::new();
    hasher.input_str(&login_user.password[..]);
    match user::User::all(&*conn) {
        Ok(users) => {
            match users
                .into_iter()
                .find(|user| user.password == hasher.result_str())
            {
                Some(user) => {
                    let res = ResponseLogin {
                        success: true,
                        uuid: user.id.clone(),
                        jwt: jwt_generate(user.id.clone()),
                    };
                    cookies.add(Cookie::new::<String, String>(
                        "jwt".into(),
                        res.jwt.to_string(),
                    ));
                    Json(res)
                }
                None => Json(ResponseLogin {
                    success: false,
                    uuid: format!(""),
                    jwt: format!(""),
                }),
            }
        }
        Err(e) => panic!(e),
    }
}

#[get("/me")]
fn me(cookies: Cookies, conn: MyDBConn) -> Json<ResponseMe> {
    let token = match cookies.get("jwt") {
        Some(jwt) => jwt,
        _ => {
            return Json(ResponseMe {
                success: false,
                username: format!(""),
            })
        }
    };

    let token_data = decode::<UserToken>(
        &token.value(),
        &DecodingKey::from_secret(KEY.as_ref()),
        &Validation::default(),
    )
    .unwrap();

    let user_found: Option<user::User> = match user::User::all(&*conn) {
        Ok(res) => res.into_iter().find(|u| u.id == token_data.claims.user_id),
        Err(e) => panic!(e),
    };

    match user_found {
        Some(u) => Json(ResponseMe {
            success: true,
            username: format!("{}", u.username),
        }),
        None => Json(ResponseMe {
            success: false,
            username: format!(""),
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
        .mount("/", routes![index, register, login, me])
        .launch();
}
