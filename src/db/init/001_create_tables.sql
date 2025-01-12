CREATE TABLE IF NOT EXISTS accounts(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    createad_at date DEFAULT now(),
    login varchar(255),
    password varchar(255),
    PRIMARY KEY(id)
);