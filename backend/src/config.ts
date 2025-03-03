

interface Config {
  JWT_SECRET: string,
  DB_URL: string,
  PORT: number,
  ACCELBYTE_TOKEN: string,
  GCAI_URL: string,
  GCAI_TOKEN: string,
  ACCELBYTE_ADMIN_SECRET: string,
  ACCELBYTE_ADMIN_CLIENT_ID: string,
  SERENDIP_WHITELIST_TOKEN: string
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_URL: process.env.DATABASE_URL!,
  PORT: Number(process.env.PORT) || 80,
  ACCELBYTE_TOKEN: process.env.ACCELBYTE_TOKEN!,
  GCAI_URL: process.env.GCAI_URL!,
  GCAI_TOKEN: process.env.GCAI_TOKEN!,
  ACCELBYTE_ADMIN_SECRET: process.env.ACCELBYTE_ADMIN_SECRET!,
  ACCELBYTE_ADMIN_CLIENT_ID: process.env.ACCELBYTE_ADMIN_CLIENT_ID!,
  SERENDIP_WHITELIST_TOKEN: process.env.SERENDIP_WHITELIST_TOKEN!
}

export default config;
