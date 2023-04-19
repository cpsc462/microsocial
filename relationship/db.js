const Database = require("better-sqlite3");
const db = new Database("./relationships.db");
module.exports.db = db;

// first time, or if we delete/reset users.db
db.exec(`CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        following_user_id INTEGER NOT NULL
    );`);

