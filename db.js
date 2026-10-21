require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL environment variable is not set. Please set it in .env or your cloud dashboard.');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to Neon PostgreSQL cloud database.');
    release();
  }
});

// Initialize tables on startup
const initTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Appointments table is ready.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Subscriptions table is ready.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS connect_form (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        idea TEXT NOT NULL,
        budget INTEGER NOT NULL,
        selectdate TEXT,
        selecttime TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Connect_form table is ready.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments_detailed (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        budget INTEGER NOT NULL,
        video_chat TEXT NOT NULL,
        idea TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Appointments_detailed table is ready.');
  } catch (err) {
    console.error('❌ Error initializing PostgreSQL tables:', err.message);
  }
};

initTables();

/**
 * Helper to convert SQLite query syntax with '?' placeholders
 * and 'INSERT OR IGNORE' into PostgreSQL compatible syntax ($1, $2, etc.)
 */
function toPgQuery(sql) {
  let paramIndex = 1;
  let pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  // Handle SQLite INSERT OR IGNORE -> PostgreSQL ON CONFLICT DO NOTHING
  if (/insert\s+or\s+ignore\s+into\s+subscriptions/i.test(pgSql)) {
    pgSql = pgSql.replace(/insert\s+or\s+ignore\s+into\s+subscriptions/i, 'INSERT INTO subscriptions') + ' ON CONFLICT (email) DO NOTHING';
  }

  return pgSql;
}

// Database interface for compatibility with existing code
const db = {
  pool,
  
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },

  run: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];

    const pgSql = toPgQuery(sql);

    pool.query(pgSql, params, (err, res) => {
      if (callback) {
        callback.call({ lastID: res?.rows?.[0]?.id, changes: res?.rowCount }, err, res);
      }
    });
  },

  get: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];

    const pgSql = toPgQuery(sql);

    pool.query(pgSql, params, (err, res) => {
      if (callback) {
        callback(err, res?.rows?.[0]);
      }
    });
  },

  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    params = params || [];

    const pgSql = toPgQuery(sql);

    pool.query(pgSql, params, (err, res) => {
      if (callback) {
        callback(err, res?.rows || []);
      }
    });
  }
};

module.exports = db;
