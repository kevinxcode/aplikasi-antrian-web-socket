const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'antrian',
    password: process.env.DB_PASSWORD || 'antrian123',
    database: process.env.DB_NAME || 'antrian_db'
});

// Initialize database tables
async function initDB() {
    const client = await pool.connect();
    try {
        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Queue transactions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS queue_transactions (
                id SERIAL PRIMARY KEY,
                queue_number VARCHAR(10) NOT NULL,
                queue_type VARCHAR(20) NOT NULL,
                customer_name VARCHAR(100),
                counter VARCHAR(10),
                status VARCHAR(20) DEFAULT 'waiting',
                called_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                called_at TIMESTAMP,
                completed_at TIMESTAMP
            )
        `);

        // Insert default users if not exists
        const bcrypt = require('bcrypt');
        const defaultUsers = [
            { username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin' },
            { username: 'cs1', password: await bcrypt.hash('cs123', 10), role: 'cs' },
            { username: 'cs2', password: await bcrypt.hash('cs123', 10), role: 'cs' },
            { username: 'teller1', password: await bcrypt.hash('teller123', 10), role: 'teller' },
            { username: 'teller2', password: await bcrypt.hash('teller123', 10), role: 'teller' }
        ];

        for (const user of defaultUsers) {
            await client.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
                [user.username, user.password, user.role]
            );
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        client.release();
    }
}

module.exports = { pool, initDB };
