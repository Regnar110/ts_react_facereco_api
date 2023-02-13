"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex_config = void 0;
exports.knex_config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME
    }
};
