import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connection, connectMySQL } from './db/mysql';
import { SignInData, SignUpData } from './types';
import cors from 'cors'; 
import { RowDataPacket } from 'mysql2';

const app = express();

app.use(express.json());
app.use(cors());

connectMySQL();

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (token) {
    jwt.verify(token, 'secret', (err, decoded: JwtPayload | undefined) => {
      if (err) {
        return res.status(403).send('Unauthorized');
      }
      if (!decoded?.userId) {
        return res.status(403).send('Unauthorized');
      }
      req.userId = decoded.userId as number;
      next();
    });
  } else {
    res.status(401).send('Unauthorized');
  }
}

app.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const [rows]: [RowDataPacket[], unknown] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.send(rows[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).send('Internal server error');
  }
});


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

app.get('/user-details', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const [rows] = await connection.query('SELECT name, email FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send({ username: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Internal server error');
  }
});

app.post('/post', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, imageUrl, category } = req.body;
  const userId = req.userId;

  try {
    await connection.query('INSERT INTO news (title, description, image_url, user_id, category, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', [title, description, imageUrl, userId, category]);
    
    res.status(201).send('News created successfully');
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/news', async (req: Request, res: Response) => {
  try {
    const [rows] = await connection.query('SELECT news.*, users.name AS userName FROM news INNER JOIN users ON news.user_id = users.id');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/news/:id', async (req: Request, res: Response) => {
  const newsId = req.params.id;

  try {
    const [rows]: [RowDataPacket[], unknown] = await connection.query('SELECT news.*, users.name AS userName FROM news INNER JOIN users ON news.user_id = users.id WHERE news.id = ?', [newsId]);
    if (rows.length === 0) {
      return res.status(404).send('News not found');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).send('Internal server error');
  }
});



const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
