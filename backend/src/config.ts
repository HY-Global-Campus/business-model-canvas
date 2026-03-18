



interface Config {
  JWT_SECRET: string,
  DB_URL: string,
  PORT: number,
  GCAI_URL: string,
  GCAI_TOKEN: string,
  NODE_ENV: string,
  FRONTEND_URL: string,
  SMTP_HOST: string,
  SMTP_PORT: number,
  SMTP_SECURE: string,
  SMTP_USER: string,
  SMTP_PASSWORD: string,
  EMAIL_FROM: string,
  MOOC_ISSUER_URL: string,
  MOOC_CLIENT_ID: string,
  MOOC_CLIENT_SECRET: string,
  MOOC_REDIRECT_URI: string,
  COOKIE_SECRET: string,
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET?.trim() || 'developmentsecret',
  DB_URL: process.env.DATABASE_URL?.trim() || 'postgres://user:password@db:5432/mydatabase',
  PORT: Number(process.env.PORT) || 8080,
  GCAI_URL: process.env.GCAI_URL?.trim() || '',
  GCAI_TOKEN: process.env.GCAI_TOKEN?.trim() || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL?.trim() || 'http://localhost:5173',
  SMTP_HOST: process.env.SMTP_HOST?.trim() || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE?.trim() || 'false',
  SMTP_USER: process.env.SMTP_USER?.trim() || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD?.trim() || '',
  EMAIL_FROM: process.env.EMAIL_FROM?.trim() || 'noreply@businessmodelcanvas.com',
  MOOC_ISSUER_URL: process.env.MOOC_ISSUER_URL?.trim() || 'https://courses.mooc.fi/api/v0/main-frontend/oauth',
  MOOC_CLIENT_ID: process.env.MOOC_CLIENT_ID?.trim() || 'bmc',
  MOOC_CLIENT_SECRET: process.env.MOOC_CLIENT_SECRET?.trim() || '',
  MOOC_REDIRECT_URI: process.env.MOOC_REDIRECT_URI?.trim() || 'http://localhost:5173/auth/callback',
  COOKIE_SECRET: process.env.COOKIE_SECRET?.trim() || (process.env.JWT_SECRET?.trim() || 'developmentsecret'),
}

export default config;
