const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, 'database.sqlite');


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err.message);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});



db.run(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('❌ Failed to create appointments table:', err.message);
  } else {
    console.log('✅ Appointments table is ready.');
  }
});



db.run(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Failed to create subscriptions table:', err.message);
  } else {
    console.log('✅ Subscriptions table is ready.');
  }
});



db.run(`
  CREATE TABLE IF NOT EXISTS connect_form (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    idea TEXT NOT NULL,
    budget INTEGER NOT NULL,
    selectdate TEXT,
    selecttime TEXT
    
  )
`, (err) => {
  if (err) {
    console.error('❌ Failed to create connect_form table:', err.message);
  } else {
    console.log('✅ connect_form table is ready.');
  }
});



db.run(`
  CREATE TABLE IF NOT EXISTS appointments_detailed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    budget INTEGER NOT NULL,
    video_chat TEXT NOT NULL,
    idea TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('❌ Failed to create appointments_detailed table:', err.message);
  } else {
    console.log('✅ appointments_detailed table is ready.');
  }
});

module.exports = db;
