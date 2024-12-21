// backend/models/user.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  },
  createUser: (email, username, password, role) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        db.query(
          "INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)",
          [email, username, hash, role],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });
    });
  },
  comparePassword: (candidatePassword, hash) => {
    return bcrypt.compare(candidatePassword, hash);
  },
  generateToken: (user) => {
    return jwt.sign(user, "your_jwt_secret", {
      expiresIn: 604800, // 1 week
    });
  },
};

module.exports = User;
