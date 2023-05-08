import { db } from '../db.js'

function createTest(tableName, columns) {
    const sql = `CREATE TABLE ${tableName} (${columns.join(', ')})`;
    try {
      db.exec(sql);
      console.log(`Table '${tableName}' created successfully.`);
    } catch (error) {
      console.error(error.message);
    }
}
  
function insertTest(tableName, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    try {
        db.prepare(sql).run(values);
        console.log(`Data inserted successfully into '${tableName}'.`);
    } catch (error) {
        console.error(error.message);
    }
}
  
function deleteTest(tableName, whereClause) {
    const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    try {
        const result = db.exec(sql);
        console.log(`${result.changes} row(s) deleted successfully from '${tableName}'.`);
    } catch (error) {
        console.error(error.message);
    }
}