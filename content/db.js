import Database from "better-sqlite3";

export const db = new Database('./contents.db')

// TEST FUNCTIONS
export const testCreateTable = () => {
    const db = new Database('./contents.db')
    db.exec(`CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body VARCHAR
    );`);
}

export const testTable = () => {
    const db = new Database('./contents.db')
    const q = db.prepare('INSERT INTO tests (body) VALUES (?)')
    q.run('This is a test')

    const getQ = db.prepare(`SELECT * FROM tests`)
    const allTests = getQ.all()
    console.log('Items retrieved: ', allTests)    
}

export const testDropTable = () => {
    db.exec(`DROP TABLE IF EXISTS tests`)
    console.log('Dropped tests table, DB sucessfully configured')
}