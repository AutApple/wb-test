require('dotenv').config();

/** @type {import('knex').Knex.Config} */
module.exports = {
    
        client: 'pg',
        connection: {
            host:     process.env.POSTGRES_HOST,
            port:     Number(process.env.POSTGRES_PORT) || 5432,
            user:     process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
        },
        migrations: {
            directory: './src/db/migrations',
            extension: 'ts',
        },
        seeds: {
            directory: './src/db/seeds',
            extension: 'ts',
        },
};