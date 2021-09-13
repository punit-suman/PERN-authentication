create table users(
    userid serial,
    username text unique not null,
    firstname text not null,
    lastname text,
    password text not null
)