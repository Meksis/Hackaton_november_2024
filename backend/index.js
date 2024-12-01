const express = require('express');
const { Client, Pool } = require('pg');
require('dotenv').config({path: '../configs.env'});
const cors = require('cors');

const app = express();
app.use(express.json()); // Для разбора JSON тела
app.use(cors());

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

// Middleware для проверки токена. Вызывается перед обработкой всех прочих listener'ов
app.use((req, res, next) => {
  const token = req.headers['authorization'] ? req.headers['authorization'].split('Bearer ')[1] : undefined; // Токен из заголовка
  if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
  }

  if (token !== process.env.AUTH_TOKEN) {
      return res.status(403).json({ error: 'Invalid token' });
  }

  next(); // Если всё в порядке, переходим к обработке маршрута
});

// Маршрут для проверки работы сервера
app.get(`/${root}`, (req, res) => {
  res.send('Hello, Node.js with PostgreSQL!');
});

// Пример запроса к PostgreSQL
app.get(`/${root}/test`, async (req, res) => {
  try {
    const result = await pool.query('SELECT 52 as response;');
    res.json(result.rows);
  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});


app.get(`/${root}/get_pierces`, async (req, res) => {
  try {
    // const params = req.query;
    // console.log(params);
    // res.json(params);

    const result = await pool.query('SELECT * FROM "Причалы";');
    res.json(result.rows);
  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});

app.get(`/${root}/get_pierce/by_id`, async (req, res) => {
  try {
    const params = req.query;
    // console.log(params);
    // res.json(params);

    const result = await pool.query('SELECT * FROM "Причалы" where "ID"=$1;', [params.ID]);
    
    console.log(params, result.rows);

    if (result.rows.length) {
      res.json(result.rows);
    }

    else {
      res.status(500).send(`Причала с запрошенным ID не существует.`);
    }

  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});

app.get(`/${root}/get_pierce/by_name`, async (req, res) => {
  try {
    const params = req.query;
    // console.log(params);
    // res.json(params);

    const result = await pool.query('SELECT * FROM "Причалы" where "Название"=$1;', [params.name]);
    
    // console.log(params, result.rows);

    if (result.rows.length) {
      res.json(result.rows);
    }

    else {
      res.status(500).send(`Причала с запрошенным названием не существует.`);
    }

  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});

app.get(`/${root}/get_data/pierce/`, async (req, res) => {
  try {
    const params = req.query;
    const pierce_id = params.pierce_id;
    const user_time = params.userTime;
    // const user_timezone = params.timeZone;

    // console.log(params);


    // console.log(params);
    // res.json(params);
    const taxi_time_arrive = 5;
    const taxi_time_drive= 10;
    const pierce_arrive_delta = 20;
    const result = await pool.query(`SELECT * FROM "Маршруты" where "ID"=${pierce_id} AND $1 BETWEEN "Причаливание" AND "Отход";`, [user_time]);
    // user_time = '10:00:00+3';
    // const result = await pool.query(`SELECT * FROM "Маршруты" where "ID"=${pierce_id} AND $1 BETWEEN "Причаливание" +${taxi_time_arrive} AND "Отход";`, [user_time]);
//     const result = await pool.query(`
//       SELECT * 
//       FROM "Маршруты" 
//       WHERE "ID" = ${pierce_id} 
//         AND '${user_time}' + '00:${taxi_time_arrive<10?'0'+taxi_time_arrive.toString():taxi_time_arrive}:00+3' BETWEEN "Причаливание" AND "Отход"
// ;
//     `);
    console.log(params, result.rows);

    if (result.rows.length) {
      res.json(result.rows);
    }

    else {
      res.json(`Причал будет свободен`);
    }

  } 
  
  catch (err) {
    res.status(500).send(`Database query failed: \n${err}`);
  }
});




// Запуск сервера
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}/`);
});


process.on('exit', () => {
    pool.end();
  });