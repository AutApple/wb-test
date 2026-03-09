import knex, { Knex } from 'knex';
import envConfig from '../config/env.config.js';

const db: Knex = knex({
    client: 'pg',
    connection: {
        host: envConfig.POSTGRES_HOST,
        port: envConfig.POSTGRES_PORT || 5432,
        user: envConfig.POSTGRES_USER,
        password: envConfig.POSTGRES_PASSWORD,
        database: envConfig.POSTGRES_DATABASE,
    },
    pool: { min: 2, max: 10 },
});

export default db;