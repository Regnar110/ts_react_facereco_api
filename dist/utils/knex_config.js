"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knex_config = void 0;
exports.knex_config = {
    client: 'pg',
    connection: {
        host: process.env.INSTANCE_UNIX_SOCKET,
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME
    }
};
