const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'much-wow-such-secure';

let CSRF_ON = true;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your client's origin
  credentials: true
}));

const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded;
    console.log(decoded);
    next();
  });
};

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'impossible-to-guess-password')`);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES ('csrfuser', 'password')`);
  }
});

app.get('/api/check-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

app.post('/api/login', (req, res) => {
  const { username, password, checked } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (checked) {
    const query = `SELECT * FROM users WHERE username = '` + username + `' AND password = '` + password + `'`;
    db.get(query, (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
            sameSite: 'none' 
          });

      res.status(200).json({ message: 'Login successful'});
    });
  } else {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
            sameSite: 'lax' 
          });

      res.status(200).json({ message: 'Login successful'});
    });
  }
});

app.get('/api/changepass', verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.query;
  const { username } = req.user;

  if (CSRF_ON) {
    const updateQuery = `UPDATE users SET password = ? WHERE username = ?`;
    db.run(updateQuery, [newPassword, username], function (updateErr) {
      if (updateErr) {
        console.error(updateErr.message);
        return res.status(500).json({ message: 'Failed to update password' });
      }

      res.status(200).json({ message: 'Password updated successfully' });
    });
  } else {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, oldPassword], (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }

      const updateQuery = `UPDATE users SET password = ? WHERE username = ?`;
      db.run(updateQuery, [newPassword, username], function (updateErr) {
        if (updateErr) {
          console.error(updateErr.message);
          return res.status(500).json({ message: 'Failed to update password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
      });
    });
  }
});

app.post('/api/set-csrf', verifyToken, (req, res) => {
  const { checked } = req.body;

  CSRF_ON = checked;
  console.log("Set CSRF to: ", CSRF_ON);

  res.status(200).send("ok");
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
