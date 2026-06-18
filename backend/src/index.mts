import express from 'express'
import loginRouter from './controllers/login.js';
import authMiddleware from './middlewares/auth.js'
import User from './models/user.js';
import { dbSync } from './services/database.js';
import BookOneRouter from './controllers/BookOneController.js'
import CourseRouter from './controllers/CourseController.js'
import cors from 'cors';
import chatbotRouter from './controllers/chatbot.js';
import exportsRouter from './controllers/exports.js';

import cookieParser from 'cookie-parser';
import config from './config.js';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultDevOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultDevOrigins;

// CORS first so preflight OPTIONS always gets Access-Control-* (before rate limit / helmet)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Security: Add helmet for security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Security: Add rate limiting (skip browser CORS preflight)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  skip: (req) => req.method === 'OPTIONS',
});

app.use(limiter);

app.use(express.json());
app.use(cookieParser(config.COOKIE_SECRET));
app.use('/login', loginRouter);

app.use('/chatbot', authMiddleware, chatbotRouter)
app.use('/bookones', authMiddleware, BookOneRouter);
app.use('/course', authMiddleware, CourseRouter);
app.use('/exports', authMiddleware, exportsRouter);


app.get('/', authMiddleware, async (_, res) => {
  res.status(200).send('Success');
})

app.get('/me', authMiddleware, async (req, res) => {
  const user: User | null = await User.findOne({
    where: {
      id: req.user?.id
    }
  });
  console.log(user)
  res.json(user);
})



const PORT = process.env.port || 8080

dbSync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to sync the database:', error);
  process.exit(1);
});



