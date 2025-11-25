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
                full_name VARCHAR(100),
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
                called_by_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                called_at TIMESTAMP,
                completed_at TIMESTAMP
            )
        `);

        // Display settings table
        await client.query(`
            CREATE TABLE IF NOT EXISTS display_settings (
                id SERIAL PRIMARY KEY,
                marquee_text TEXT DEFAULT 'Selamat Datang di Sistem Antrian',
                slide_images TEXT[] DEFAULT '{}',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_by INTEGER REFERENCES users(id)
            )
        `);

        // Insert default display settings
        await client.query(`
            INSERT INTO display_settings (marquee_text, slide_images)
            SELECT 'Selamat Datang di Sistem Antrian', ARRAY[]::TEXT[]
            WHERE NOT EXISTS (SELECT 1 FROM display_settings LIMIT 1)
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
