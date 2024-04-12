import express from 'express'
import loginRouter from './controllers/login.js';
import authMiddleware from './middlewares/auth.js'
import User from './models/user.js';

const app = express();
app.use(express.json());
app.use('/login', loginRouter);

app.get('/', authMiddleware, async (req, res) => {
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


const PORT = process.env.port || 80
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


