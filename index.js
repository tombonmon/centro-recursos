const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Conexión con PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Página principal
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM recursos ORDER BY id DESC');
  res.render('index', { recursos: result.rows });
});

// Agregar recurso
app.post('/agregar', async (req, res) => {
  const { titulo, descripcion, tipo, url } = req.body;
  await pool.query(
    'INSERT INTO recursos (titulo, descripcion, tipo, url) VALUES ($1, $2, $3, $4)',
    [titulo, descripcion, tipo, url]
  );
  res.redirect('/');
});

app.listen(port, () => console.log(`App en http://localhost:${port}`));
