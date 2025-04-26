const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Sample in-memory storage (JSON file for simplicity)
const usersFilePath = path.join(__dirname, 'users.json');

// Get all users
app.get('/api/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read users' });
        res.json(JSON.parse(data));
    });
});

// Add a new user
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') return res.status(500).json({ error: 'Failed to read users' });

        const users = err ? [] : JSON.parse(data);
        users.push({ username, password });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save user' });
            res.status(201).json({ message: 'User created successfully' });
        });
    });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
