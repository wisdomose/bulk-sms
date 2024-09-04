import { envSchema } from "env-schema";

type Env = {
  PORT: number;
  SALT: number;
  DB_URI: string;
  FORGOT_PASSWORD_SECRET: string;
  SECRET: string;
  API_URL: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  PAYSTACK_KEY: string;
  SUPPORT_EMAIL: string;
  SUPPORT_EMAIL_PASSWORD: string;
  COWRY_API_KEY: string;
  SMS_API_URL: string;
  SMS_API_KEY: string;
  SMS_API_SHORT_CODE: string;
};

const schema = {
  type: "object",
  required: [
    "PORT",
    "SALT",
    "DB_URI",
    "FORGOT_PASSWORD_SECRET",
    "SECRET",
    "API_URL",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "PAYSTACK_KEY",
    "SUPPORT_EMAIL",
    "SUPPORT_EMAIL_PASSWORD",
    "SMS_API_URL",
    "SMS_API_KEY",
    "SMS_API_SHORT_CODE",
  ],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    SALT: {
      type: "number",
    },
    DB_URI: { type: "string" },
    SECRET: { type: "string" },
    FORGOT_PASSWORD_SECRET: { type: "string" },
    API_URL: { type: "string" },
    SUPER_ADMIN_EMAIL: { type: "string" },
    SUPER_ADMIN_PASSWORD: { type: "string" },
    PAYSTACK_KEY: { type: "string" },
    SUPPORT_EMAIL: { type: "string" },
    SUPPORT_EMAIL_PASSWORD: { type: "string" },
    SMS_API_URL: { type: "string" },
    SMS_API_KEY: { type: "string" },
    SMS_API_SHORT_CODE: { type: "string" },
  },
};

const schemaConfig = envSchema<Env>({
  schema: schema,
  dotenv: true,
});

export default schemaConfig;
