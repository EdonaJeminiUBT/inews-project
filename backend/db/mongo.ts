import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://ubt:Victoria12@cluster0.c6byzga.mongodb.net/';

const client = new MongoClient(uri);

async function connectMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

export { client, connectMongo };
