import Database from 'better-sqlite3';

export const db = new Database(process.env.SQLITE_PATH || 'database.sqlite');

// initialize schema
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    cost REAL NOT NULL,
    dueDate TEXT,
    displayOrder INTEGER NOT NULL UNIQUE
  )
`).run();