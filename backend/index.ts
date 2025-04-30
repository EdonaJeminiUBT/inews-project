import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from './db/mongo';
import { SignInData, SignUpData } from './types';
import cors from 'cors'; 


const app = express();

app.use(express.json());
app.use(cors());


// Sign up route
app.post('/signup', async (req: Request, res: Response) => {
  const { email, password, name } = req.body as SignUpData;

  try {
    const db = client.db('inews');
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email address already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({ email, password: hashedPassword, name });

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Internal server error');
  }
});



// Sign in route
app.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body as SignInData;

  try {
    // Access the MongoDB database and collection
    const db = client.db('inews');
    const usersCollection = db.collection('users');

    // Find user in the collection
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

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
