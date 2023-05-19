const Database = require("better-sqlite3");
const db = new Database("./events.db");
module.exports.db = db;

// first time, or if we delete/reset events.db
db.exec(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        message TEXT,
        severity TEXT,
        time TEXT,
        recovery_email TEXT
    );`);

db.exec(`INSERT INTO events (type, message, severity, time, recovery_email) VALUES
        ('Type 1', 'Message 1', 'Severity 1', '2023-05-18', 'recovery1@example.com'),
        ('Type 2', 'Message 2', 'Severity 2', '2023-05-19', 'recovery2@example.com'),
        ('Type 3', 'Message 3', 'Severity 3', '2023-05-20', 'recovery3@example.com'),
        ('Type 4', 'Message 4', 'Severity 4', '2023-05-21', 'recovery4@example.com'),
        ('Type 5', 'Message 5', 'Severity 5', '2023-05-22', 'recovery5@example.com');`);

function getUserByRecoveryEmail(recoveryEmail) {
    const stmt = db.prepare("SELECT * FROM users WHERE recovery_email = ?");
    return stmt.all(recoveryEmail);
}
          
module.exports = {
    db,
    getUserByRecoveryEmail
};
          