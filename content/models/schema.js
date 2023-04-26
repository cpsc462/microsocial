import { db } from "../db.js";

export const createDatabase = () => {
    // Just a sample schema for now
    // Keep info needed for a post
    db.exec(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        title TEXT NOT NULL,
        date DATE,
        tags TEXT NOT NULL,
        image TEXT,
        description TEXT
    );`);
    
    // Keep info needed for a comment
    db.exec(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INT,
        username TEXT NOT NULL,
        body TEXT NOT NULL,
        date DATE
    );`);
    
    // keep track of # user like a post
    db.exec(`CREATE TABLE IF NOT EXISTS likesPost (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        post_id INTEGER
    );`);
    
    // Keep track of # user like a comment
    db.exec(`CREATE TABLE IF NOT EXISTS likesComment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        comment_id INTEGER
    );`)

    // Indexing attribute
    db.exec(`CREATE INDEX IF NOT EXISTS idx_post_username ON posts (username);`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_comment_post_id ON comments (post_id);`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_comment_username ON comments (username);`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likesPost (post_id);`)
    db.exec(`CREATE INDEX IF NOT EXISTS idx_likes_comment_id ON likesComment (comment_id);`)

    console.log("Tables created")
}