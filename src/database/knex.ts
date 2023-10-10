import knex, { Knex } from "knex";

export const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./src/database/introducao-knex.db"
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
        afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb)
        }
    }
})