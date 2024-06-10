

interface Config {
  JWT_SECRET: string,
  DB_URL: string,
  PORT: number,
  ACCELBYTE_TOKEN: string
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_URL: process.env.DATABASE_URL!,
  PORT: Number(process.env.PORT) || 80,
  ACCELBYTE_TOKEN: process.env.ACCELBYTE_TOKEN!
}

export default config;
