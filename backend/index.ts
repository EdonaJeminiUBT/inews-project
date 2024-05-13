import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connection, connectMySQL } from './db/mysql';
import { SignInData, SignUpData } from './types';
import cors from 'cors'; 
import { RowDataPacket } from 'mysql2';
import axios from 'axios';
import { client, connectMongo } from './db/mongo'; 

const app = express();

app.use(express.json());
app.use(cors());

connectMySQL();
connectMongo();


interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function validate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

app.get('/user-details', validate, async (req: AuthenticatedRequest, res: Response) => {
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

app.post('/post', validate, async (req: AuthenticatedRequest, res: Response) => {
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

app.get('/user-posts', validate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    const [rows] = await connection.query('SELECT * FROM news WHERE user_id = ?', [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).send('Internal server error');
  }
});

app.put('/edit/news/:id', validate, async (req: AuthenticatedRequest, res: Response) => {
  const newsId = req.params.id;
  const { title, description, imageUrl, category } = req.body;
  const userId = req.userId;

  try {
    const [existingNews]: [RowDataPacket[], unknown] = await connection.query('SELECT * FROM news WHERE id = ? AND user_id = ?', [newsId, userId]);
    if (!existingNews || existingNews.length === 0) {
      return res.status(404).send('News not found');
    }

    await connection.query('UPDATE news SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?', [title, description, imageUrl, category, newsId]);

    res.status(200).send('News updated successfully');
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).send('Internal server error');
  }
});

app.delete('/news/:id', validate, async (req: AuthenticatedRequest, res: Response) => {
  const newsId = req.params.id;
  const userId = req.userId;

  try {
    const [existingNews]: [RowDataPacket[], unknown] = await connection.query('SELECT * FROM news WHERE id = ? AND user_id = ?', [newsId, userId]);
    if (!existingNews || existingNews.length === 0) {
      return res.status(404).send('News not found');
    }

    await connection.query('DELETE FROM news WHERE id = ?', [newsId]);

    res.status(200).send('News deleted successfully');
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).send('Internal server error');
  }
});
app.post('/weather', async (req, res) => {
  const { city, country, userEmail } = req.body; 

  try {
    const apiKey = '3002c2a1e57b545d8862dbd2bf06f635';
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`);
    const weatherData = response.data;
    const currentTime = new Date();

    const [rows] = await connection.query('SELECT id, name FROM users WHERE email = ?', [userEmail]);
    const userId = rows[0]?.id || null; 
    const userName = rows[0]?.name || 'Unknown'; 

    await client.connect();
    const db = client.db('weatherApp');
    const collection = db.collection('weather');
    await collection.insertOne({
      city,
      country,
      weatherData,
      category: 'weather',
      created_at: currentTime,
      userId: userId,
      userName: userName 
    });
    res.status(200).send('Weather data saved successfully');
  } catch (error) {
    console.error('Error fetching or storing weather data:', error);
    res.status(500).send('Internal server error');
  }
});




app.get('/weather-news', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('weatherApp');
    const collection = db.collection('weather');

    if (!collection) {
      throw new Error('Weather collection not found');
    }

    const weatherNews = await collection.find({ category: 'weather' }).toArray();

    res.status(200).json(weatherNews);
  } catch (error) {
    console.error('Error fetching weather news:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/user-weather-news', validate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    await client.connect();
    const db = client.db('weatherApp');
    const collection = db.collection('weather');

    if (!collection) {
      throw new Error('Weather collection not found');
    }

    const weatherUserNews = await collection.find({ category: 'weather', user_id: userId }).toArray();

    res.status(200).json(weatherUserNews);
  } catch (error) {
    console.error('Error fetching user weather news:', error);
    res.status(500).send('Internal server error');
  }
});


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
