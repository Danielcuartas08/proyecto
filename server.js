// server.js
const express = require('express');
const path    = require('path');
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcrypt');

const app = express();

//(HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

//Parseo de body para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Conexiones a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       // tu usuario
  password: '',       // tu contraseña (si la hay)
  database: 'bmw_shop'
});

// Registro de clientes
app.post('/api/register/client', async (req, res) => {
  // Mira qué llega del cliente
  console.log('▶︎ /api/register/client BODY:', req.body);

  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    //INSERT y mira el resultado
    const [result] = await pool.execute(
      `INSERT INTO clients (name,email,password) VALUES (?,?,?)`,
      [name, email, hash]
    );
    console.log('✓ INSERT OK, new client id =', result.insertId);

    return res.status(201).json({ status: 'client registered', id: result.insertId });
  } catch (e) {
    // Muestra el error completo
    console.error('❌ ERROR inserting client:', e);
    return res.status(500).json({ error: e.message });
  }
});

//iniciar sesion de clientes
// Login Cliente

app.post('/api/login/client', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Busca nombre y hash
    const [rows] = await pool.execute(
      `SELECT name, password FROM clients WHERE email = ?`,
      [email]
    );
    if (rows.length && await bcrypt.compare(password, rows[0].password)) {
      // Éxito: devuelve nombre
      return res.status(200).json({ status: 'ok', name: rows[0].name });
    }
    return res.status(401).json({ error: 'Credenciales inválidas' });
  } catch (e) {
    console.error('ERROR login-client:', e);
    return res.status(500).json({ error: e.message });
  }
});

// Ruta para iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
