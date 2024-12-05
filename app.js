const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'localhost', // Change to your DB host
    user: 'root',      // Change to your DB user
    password: 'sharath',      // Change to your DB password
    database: 'marvel_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

// API to Insert a Marvel Character
app.post('/characters', (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = 'INSERT INTO characters (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('Error inserting character:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: result.insertId, name, description });
    });
});

// API to Retrieve All Marvel Characters
app.get('/characters', (req, res) => {
    const query = 'SELECT * FROM characters';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching characters:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});