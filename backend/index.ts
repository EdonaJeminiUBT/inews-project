import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connection, connectMySQL } from './db/mysql';
import { SignInData, SignUpData } from './types';
import cors from 'cors'; 

const app = express();

app.use(express.json());
app.use(cors());

connectMySQL();

app.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body as SignUpData;

  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(400).send('Email address already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body as SignInData;

  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });

    res.send({ token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
