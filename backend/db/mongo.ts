import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://edonajemini:Victoria12@cluster0.iw6pigb.mongodb.net/';

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
