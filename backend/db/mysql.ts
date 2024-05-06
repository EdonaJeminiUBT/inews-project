import mysql, { Connection } from 'mysql2/promise';

const connectionConfig = {
  host: 'localhost',
  user: 'root', 
  password: 'Victoria12',
  database: 'inews' 
};

let connection: Connection;

async function connectMySQL() {
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
}

export { connection, connectMySQL };
