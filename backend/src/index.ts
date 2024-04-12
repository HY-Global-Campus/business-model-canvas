import sequelize from './services/database.js'
import express from 'express'
import loginRouter from './controllers/login.js';
import authMiddleware from './middlewares/auth.js'

const app = express();
app.use(express.json());
app.use('/login', loginRouter);

app.get('/', authMiddleware, async (req, res) => {
  res.status(200).send('Success');
})



const PORT = process.env.port || 80
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


