const express = require('express');
const { Client, Pool } = require('pg');
require('dotenv').config({path: '../configs.env'});

const app = express();
const port = process.env.APP_PORT;

// Используем переменные окружения из .env
// const client = new Client({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });


const root = 'node';

pool.query('SELECT 1;', (err, res) => {
    if (err) {
        console.error(err);
    } 
    else {
        console.log('Connected to PostgreSQL');
    }
});

// Маршрут для проверки работы сервера
app.get(`/${root}`, (req, res) => {
  res.send('Hello, Node.js with PostgreSQL!');
});

// Пример запроса к PostgreSQL
app.get(`/${root}/users`, async (req, res) => {
  try {
    const result = await pool.query('SELECT 52;');
    res.json(result.rows);
  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


process.on('exit', () => {
    pool.end();
  });