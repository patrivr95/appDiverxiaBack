const mysql = require('mysql2')

// Creamos la conexión con la base de datos con nuestros valores del .ENV
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
})

global.db = pool