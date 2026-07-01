const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/backend/.env' });

const createDB = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to default db to create new one
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'asset_management'};`);
    console.log(`Database ${process.env.DB_NAME || 'asset_management'} created successfully.`);
  } catch (err) {
    if (err.code === '42P04') { // duplicate_database error code
      console.log(`Database ${process.env.DB_NAME || 'asset_management'} already exists.`);
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
};

createDB();
