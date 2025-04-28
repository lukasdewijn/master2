// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Enable CORS to allow credentials from your client origin
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,  // corrected spelling
    cookie: { secure: false }  // In production, use secure cookies with HTTPS
}));

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

// Endpoint for complete onboarding (register new business)
app.post('/api/complete-onboarding', (req, res) => {
    const {
        manager_first_name,
        manager_last_name,
        horeca_name, // inserted as horeca_name
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
        horeca_name,
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

// Endpoint for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const sql = 'SELECT * FROM business_info WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            // User not found
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const user = results[0];
        // Compare hashed passwords
        if (bcrypt.compareSync(password, user.password)) {
            // Save user details in session
            req.session.user = {
                id: user.id,
                email: user.email,
                manager_first_name: user.manager_first_name,
                manager_last_name: user.manager_last_name,
            };
            return res.json({ success: true, user: req.session.user });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
}

// Protected route to get logged-in user info
app.get('/api/user', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

app.listen(3007, () => {
    console.log('Server running on http://localhost:3007');
});
