const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || undefined,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      connectTimeout: 5000
    });

    console.log('Conexión OK — MySQL versión:', (await connection.query('SELECT VERSION() as v'))[0][0].v);
    await connection.end();
  } catch (err) {
    console.error('Error conexión MySQL:', err.message);
    if (err.code) console.error('Código error:', err.code);
    process.exit(1);
  }
}

test();
