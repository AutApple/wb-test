import dotenv from 'dotenv';
import z from 'zod';

if (process.env.NODE_ENV !== 'PROD')
    dotenv.config();

// im using zod to parse dotenv variables
const ZodEnvSchema =  z.object({
    NODE_ENV: z.enum(['DEV', 'PROD']),
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_PASSWORD: z.string().default('postgres'),
    POSTGRES_PORT: z.coerce.number().default(5432),
    POSTGRES_DB: z.string(),

    WB_API_KEY: z.string(),

    GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
    GOOGLE_PRIVATE_KEY: z.string()
});

const result = ZodEnvSchema.safeParse(process.env);

if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(z.flattenError(result.error));
    process.exit(1);
}

const envConfig = result.data;

export default envConfig;