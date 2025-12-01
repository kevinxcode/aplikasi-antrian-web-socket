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
                counter_access VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Add counter_access column if not exists
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS counter_access VARCHAR(10)
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
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_by INTEGER REFERENCES users(id)
            )
        `);
        
        // Image slides table
        await client.query(`
            CREATE TABLE IF NOT EXISTS image_slides (
                id SERIAL PRIMARY KEY,
                image_data TEXT NOT NULL,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by INTEGER REFERENCES users(id)
            )
        `);

        // Insert default display settings
        await client.query(`
            INSERT INTO display_settings (marquee_text)
            SELECT 'Selamat Datang di Sistem Antrian'
            WHERE NOT EXISTS (SELECT 1 FROM display_settings LIMIT 1)
        `);

        // Insert default users if not exists
        const bcrypt = require('bcrypt');
        const defaultUsers = [
            { username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin', counter_access: null },
            { username: 'cs1', password: await bcrypt.hash('cs123', 10), role: 'cs', counter_access: 'cs1' },
            { username: 'cs2', password: await bcrypt.hash('cs123', 10), role: 'cs', counter_access: 'cs2' },
            { username: 'teller1', password: await bcrypt.hash('teller123', 10), role: 'teller', counter_access: 't1' },
            { username: 'teller2', password: await bcrypt.hash('teller123', 10), role: 'teller', counter_access: 't2' }
        ];

        for (const user of defaultUsers) {
            await client.query(
                'INSERT INTO users (username, password, role, counter_access) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
                [user.username, user.password, user.role, user.counter_access]
            );
        }
        
        await client.query(`UPDATE users SET counter_access = 'cs1' WHERE username = 'cs1' AND counter_access IS NULL`);
        await client.query(`UPDATE users SET counter_access = 'cs2' WHERE username = 'cs2' AND counter_access IS NULL`);
        await client.query(`UPDATE users SET counter_access = 't1' WHERE username = 'teller1' AND counter_access IS NULL`);
        await client.query(`UPDATE users SET counter_access = 't2' WHERE username = 'teller2' AND counter_access IS NULL`);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    } finally {
        client.release();
    }
}

module.exports = { pool, initDB };
