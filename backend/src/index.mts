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

// Security: Add helmet for security headers
app.use(helmet());

// Security: Add rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

// Apply rate limiting to all requests
app.use(limiter);

// CORS with more secure configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

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



