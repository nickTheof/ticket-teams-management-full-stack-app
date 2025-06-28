import dotenv from 'dotenv';
import {z} from "zod/v4";
import {envSchema} from "@/core/configuration/env.schema";

export type ConfigurationEnvType = z.infer<typeof envSchema>;

dotenv.config();

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error("Invalid environment variables:");
    console.error(z.treeifyError(_env.error))
    process.exit(1);
}

const env = _env.data;

export const env_config: ConfigurationEnvType = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    API_VERSION: env.API_VERSION,
    FRONTEND_VERIFICATION_URL: env.FRONTEND_VERIFICATION_URL,
    FRONTEND_PASSWORD_RECOVERY_URL: env.FRONTEND_PASSWORD_RECOVERY_URL,
    FRONTEND_UNLOCK_ACCOUNT_URL: env.FRONTEND_UNLOCK_ACCOUNT_URL,
    SALT_ROUNDS: env.SALT_ROUNDS,
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS,
    JWT_SECRET: env.JWT_SECRET,
    JWT_EXPIRES: env.JWT_EXPIRES,
    RATE_LIMIT_MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MINUTES: env.RATE_LIMIT_WINDOW_MINUTES,
    MAILER_HOST: env.MAILER_HOST,
    MAILER_PORT: env.MAILER_PORT,
    MAILER_USERNAME: env.MAILER_USERNAME,
    MAILER_PASSWORD: env.MAILER_PASSWORD,
    MONGODB_URI: env.MONGODB_URI,
}

export default env_config;