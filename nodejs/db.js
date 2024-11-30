const { Client, Pool } = require('pg');
// const express = require('express');
const fs = require('fs');
const XLSX = require('xlsx');
const dayjs = require('dayjs');


require('dotenv').config({path: '../configs.env'});

// const app = express();
// const port = process.env.APP_PORT;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


function convertExcelTimeToDayJS(excelTime) {
  const totalSeconds = Math.round(excelTime * 24 * 60 * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return dayjs(`${hours}:${minutes}:${seconds}`, 'H:m:s').format('HH:mm:ss') + '+03:00';
}

function readXlsxFile(filePath, list, columns) {
  const file = fs.readFileSync(filePath);
  const workbook = XLSX.read(file, { type: 'buffer' });
  const sheetName = workbook.SheetNames[list]; // Берем первый лист
  const sheet = workbook.Sheets[sheetName];
  
  const data = XLSX.utils.sheet_to_json(sheet);

  const filteredData = columns ? data.map(row => {    // Если переданы столбцы, то проходимся по всем, что есть, и отбираем те, что нам нужны
    const filteredRow = {};
    columns.forEach(column => {
      if (column in row) {
        filteredRow[column] = row[column];
      }
    });
    return filteredRow;
  }): data;


  return filteredData;
}

async function saveToDatabase(data, table_name) {
  try {
    const exists = await pool.query('SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = $1)'
      , [table_name]
    );

    if (! exists.rows[0].exists) {
      console.log(`Creating ${table_name} table...`);

      if (table_name == "Причалы") {
        const columnNames = Object.keys(data[0]);
        const query = `
          CREATE TABLE "${table_name}" (
            "${columnNames[0]}" TEXT, 
            "${columnNames[1]}" INTEGER PRIMARY KEY, 
            "${columnNames[2]}" TEXT, 
            "${columnNames[3]}" TEXT, 
            "${columnNames[4]}" DECIMAL(12, 6), 
            "${columnNames[5]}" DECIMAL(12, 6)
          );
        `;

        await pool.query(query);
        console.log(`OK`);
      }
      
      else if (table_name == "Маршруты") {
        const columnNames = Object.keys(data[0]);
        const query = `
          CREATE TABLE "${table_name}" (
            "${columnNames[0]}" TEXT, 
            "${columnNames[1]}" TIME WITH TIME ZONE, 
            "${columnNames[2]}" INTEGER PRIMARY KEY, 
            "${columnNames[3]}" INTEGER, 
            "${columnNames[4]}" TEXT, 
            "${columnNames[5]}" TEXT,
            "${columnNames[6]}" TEXT,
            "${columnNames[7]}" TIME WITH TIME ZONE
          );
        `;

        await pool.query(query);
        console.log(`OK`);
      }
      
    }

    // console.log(Object.values(data[0]));
    console.log(`Inserting values into ${table_name} table...`);

    if (table_name == "Причалы") {
        data.forEach(async function (dict) {
          try {
          await pool.query(`INSERT INTO ${table_name} VALUES($1, $2, $3, $4, $5, $6)`,
            Object.values(dict)
          );
        }

        catch (error) {
          if (error.code=='23505') {
            console.warn(`[E] Error during values inserting values - ${error.detail}`);
          }

          else {
            console.error(error);
          }
        }
        });
        console.log(`OK`)
      }

    else if (table_name == 'Маршруты') {
      console.log(`Inserting values into ${table_name} table...`)
          data.forEach(async function (dict) {
            try {
              await pool.query(`INSERT INTO ${table_name} VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
                Object.values(dict)
              );
            }
  
            catch (error) {
              if (error.code=='23505' || error.code=='08P01') {
                console.warn(`[E] Error during values inserting values - ${error.detail ? error.detail : 'code - ' + error.code}`);
              }
    
              else {
                console.error(error);
                console.warn(dict);
              }
            }
          });
          console.log(`OK`)
    }


  }
 
 catch (err) {
    console.error(err);
 }

}

// Читаем файл, страницу причалов, переименовываем 3 столбца
const filePath = '../data/расписание_и_причалы.xlsx'; // Путь к вашему файлу
const races = readXlsxFile(filePath, 1, ['Уникальный ID записи', 'ID причала', 'Название причала', 'Название судна - отсутсвует если отменено', 'Название маршрута ', 'Швартовочное место', 'Причаливание/подход', 'Отход']).slice(1);
const piers = readXlsxFile(filePath, 0).slice(1);

piers.forEach(function (row, index) {
    Object.keys(row).forEach(function (column) {
      // console.log(row);
      if (column.includes('координаты')) {
        row[column[column.length-1] == 1 ? 'Широта' : 'Долгота'] = row[column];
        delete row[column];
      }

      else if (column.split(' ').length > 1) {
        row[column.split(' ')[0]] = row[column];
        delete row[column];
      }
      // console.log(row);
    });
});

races.forEach(function (row, index) {
  if (! Object.keys(row).includes('Название судна - отсутсвует если отменено')) {
    let entries = Object.entries(row); // Преобразуем объект в массив пар
    entries.splice(3, 0, ['Название судна - отсутсвует если отменено', 'Отменено']); // Вставляем на нужную позицию
    races[index] = Object.fromEntries(entries);
  }

  if (! Object.keys(row).includes('Причаливание/подход')) {
    let entries = Object.entries(row); // Преобразуем объект в массив пар
    entries.splice(6, 0, ['Причаливание/подход', 0]); // Вставляем на нужную позицию
    races[index] = Object.fromEntries(entries);
  };
});

races.forEach(function (row) {
  Object.keys(row).forEach(function (column) {
    if (column.includes('Уникальный ID записи')) {
      row['ID'] = row[column];
      delete row[column];
    }

    else if (column.includes('ID причала')) {
      row['ID_причала'] = row[column];
      delete row[column];
    }

    else if (column.includes('Название маршрута')){
      row['Название'] = row[column];
      delete row[column];
    }

    else if (column.includes('Швартовочное место')){
      row['Место'] = row[column];
      delete row[column];
    }

    else if (column.includes('Причаливание')){
      row['Причаливание'] = typeof row[column] === "string" ? row[column] : convertExcelTimeToDayJS(row[column]);
      // if (typeof row[column] === "string") { console.log(`Уже меняли. Результат - ${row[column]}`)}
      delete row[column];
    }

    else if (column.includes('Отход')){
      row['Отход'] = convertExcelTimeToDayJS(row[column]);
    }

    else if (column.includes('Название судна - отсутсвует если отменено')){
      row['Судно'] = row[column];
      delete row[column];
    }
  });
})

// console.log(races[races.length-1]);

async function main() {
  await pool.query('SELECT 1;', (err, res) => {
    if (err) {
        console.error(err);
    } 
    else {
        console.log('Connected to PostgreSQL');
    }
  });
  await saveToDatabase(piers, 'Причалы');
  await saveToDatabase(races, 'Маршруты');

  // const res = await pool.query('SELECT * FROM "Маршруты" WHERE "ID"=840171');
  // console.log(res.rows)

  
}

main();


process.on('exit', () => {
    pool.end();
});