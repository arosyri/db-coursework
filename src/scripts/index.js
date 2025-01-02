const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'karina',
    database: 'mydb',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connection to database successful!');
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM User';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM User WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/users', (req, res) => {
    const { username, email, password, roleId, status } = req.body;
    const query = 'INSERT INTO User (username, email, password, roleId, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, password, roleId, status], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'User created', userId: result.insertId });
        }
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password, roleId, status } = req.body;
    const query = 'UPDATE User SET username = ?, email = ?, password = ?, roleId = ?, status = ? WHERE id = ?';
    db.query(query, [username, email, password, roleId, status, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'User updated' });
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM User WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'User deleted' });
        }
    });
});

app.get('/roles', (req, res) => {
    const query = 'SELECT * FROM Role';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});


app.get('/roles/:id', (req, res) => {
    const roleId = req.params.id;
    const query = 'SELECT * FROM Role WHERE id = ?';
    db.query(query, [roleId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Role not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/roles', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Role (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'Role created', roleId: result.insertId });
        }
    });
});

app.put('/roles/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const query = 'UPDATE Role SET name = ? WHERE id = ?';
    db.query(query, [name, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json({ message: 'Role updated' });
    });
});

app.delete('/roles/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Role WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'Role deleted' });
        }
    });
});

app.get('/members', (req, res) => {
    const query = 'SELECT * FROM Member';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});

app.get('/members/:id', (req, res) => {
    const memberId = req.params.id;
    const query = 'SELECT * FROM Member WHERE id = ?';
    db.query(query, [memberId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Member not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/members', (req, res) => {
    const { userId, teamId, teamRole } = req.body;
    const query = 'INSERT INTO Member (userId, teamId, teamRole) VALUES (?, ?, ?)';
    db.query(query, [userId, teamId, teamRole], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'Member added', memberId: result.insertId });
        }
    });
});

app.put('/members/:id', (req, res) => {
    const { id } = req.params;
    const { userId, teamId, teamRole } = req.body;
    const query = 'UPDATE Member SET userId = ?, teamId = ?, teamRole = ? WHERE id = ?';
    db.query(query, [userId, teamId, teamRole, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member updated' });
    });
});

app.delete('/members/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Member WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'Member removed' });
        }
    });
});

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});

