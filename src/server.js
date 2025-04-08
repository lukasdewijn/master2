// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Create a connection to your local MySQL server
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // e.g., 3306
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

// Define the endpoint as /api/complete-onboarding
app.post('/api/complete-onboarding', (req, res) => {
    const {
        manager_first_name,
        manager_last_name,
        horeca_name, // will be mapped to business_name
        address,
        phonenumber,
        email,
        password
    } = req.body;

    const sql = `
    INSERT INTO business_info
      (manager_first_name, manager_last_name, horeca_name, address, phone_number, email, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const params = [
        manager_first_name,
        manager_last_name,
        horeca_name, // mapping horeca_name to business_name
        address,
        phonenumber,
        email,
        password
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, insertedId: result.insertId });
    });
});

// (Optional) Define GET endpoint as well if needed
app.get('/api/complete-onboarding', (req, res) => {
    const sql = 'SELECT * FROM business_info';
    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

const bcrypt = require('bcryptjs'); // If you plan to compare hashed passwords

// Add this endpoint on your server
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Query to find the user by email in your business_info table
    const sql = 'SELECT * FROM business_info WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            // User not found
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = results[0];
        // Compare the provided password with the hashed password stored in the database
        if (bcrypt.compareSync(password, user.password)) {
            // If matched, return success (you could also return user data or a token)
            return res.json({ success: true, user });
        } else {
            // Password did not match
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(3007, () => {
    console.log('Server running on http://localhost:3007');
});
