CREATE TABLE IF NOT EXISTS accounts(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    createad_at date DEFAULT now(),
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);