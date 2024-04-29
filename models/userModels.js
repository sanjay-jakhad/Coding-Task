const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
});

class UserModel {
  static createUser({ firstName, lastName, email, password }) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, password],
        (err, result) => {
          if (err) {
            if (err.code === 'Error Duplicate Entry') {
              return reject(new Error('Email already exists'));
            }
            return reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  static getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static updatePassword(token, newPassword) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET password_hash = ? WHERE reset_token = ?', [newPassword, token], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return reject(new Error('Invalid or expired token'));
        }
        resolve(result);
      });
    });
  }
}

module.exports = UserModel;
