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
                logo_base64 TEXT,
                left_image_base64 TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_by INTEGER REFERENCES users(id)
            )
        `);
        
        // Add logo and left_image columns if not exists
        await client.query(`
            ALTER TABLE display_settings 
            ADD COLUMN IF NOT EXISTS logo_base64 TEXT,
            ADD COLUMN IF NOT EXISTS left_image_base64 TEXT
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
        
        // Premium activation table
        await client.query(`
            CREATE TABLE IF NOT EXISTS premium_activation (
                id SERIAL PRIMARY KEY,
                is_activated BOOLEAN DEFAULT FALSE,
                passcode_id INTEGER,
                activated_at TIMESTAMP,
                activated_by INTEGER REFERENCES users(id)
            )
        `);
        
        await client.query(`
            ALTER TABLE premium_activation 
            ADD COLUMN IF NOT EXISTS passcode_id INTEGER
        `);
        
        // Premium passcode table
        await client.query(`
            CREATE TABLE IF NOT EXISTS premium_passcode (
                id SERIAL PRIMARY KEY,
                passcode_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Printer settings table
        await client.query(`
            CREATE TABLE IF NOT EXISTS printer_settings (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) DEFAULT 'BTN Syariah',
                address VARCHAR(255) DEFAULT 'Jl. Sopo Del No 56 Jakarta Selatan',
                footer TEXT DEFAULT '',
                paper_size VARCHAR(10) DEFAULT '58mm',
                use_qz_tray BOOLEAN DEFAULT FALSE,
                qz_printer_name VARCHAR(255) DEFAULT '',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_by INTEGER REFERENCES users(id)
            )
        `);
        
        // Add QZ Tray columns if not exists
        await client.query(`
            ALTER TABLE printer_settings 
            ADD COLUMN IF NOT EXISTS footer TEXT,
            ADD COLUMN IF NOT EXISTS paper_size VARCHAR(10) DEFAULT '58mm',
            ADD COLUMN IF NOT EXISTS use_qz_tray BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS qz_printer_name VARCHAR(255) DEFAULT ''
        `);
        
        // Insert default printer settings
        await client.query(`
            INSERT INTO printer_settings (title, address, footer, paper_size, use_qz_tray, qz_printer_name)
            SELECT 'BTN Syariah', 'Jl. abc d No 000 Jakarta Selatan', '', '58mm', FALSE, ''
            WHERE NOT EXISTS (SELECT 1 FROM printer_settings LIMIT 1)
        `);
        
        // Update old column names to new ones
        await client.query(`
            UPDATE printer_settings 
            SET footer = COALESCE(footer_note, ''), 
                paper_size = COALESCE(paper_width, '58mm')
            WHERE footer IS NULL OR paper_size IS NULL
        `);
        
        await client.query(`
            INSERT INTO premium_activation (is_activated)
            SELECT FALSE
            WHERE NOT EXISTS (SELECT 1 FROM premium_activation LIMIT 1)
        `);

        // Insert default display settings
        await client.query(`
            INSERT INTO display_settings (marquee_text)
            SELECT 'Selamat Datang di Sistem Antrian'
            WHERE NOT EXISTS (SELECT 1 FROM display_settings LIMIT 1)
        `);

        // Insert default users if not exists
        const bcrypt = require('bcrypt');
        const defaultPasscode = await bcrypt.hash('kevin123', 10);
        await client.query(`
            INSERT INTO premium_passcode (passcode_hash)
            SELECT $1
            WHERE NOT EXISTS (SELECT 1 FROM premium_passcode LIMIT 1)
        `, [defaultPasscode]);
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

        // Add indexes for performance
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_created_at ON queue_transactions(created_at)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_type ON queue_transactions(queue_type)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_status ON queue_transactions(status)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_counter ON queue_transactions(counter)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_called_at ON queue_transactions(called_at)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_queue_type_status_date ON queue_transactions(queue_type, status, created_at)');
        
        console.log('Database initialized successfully with indexes');
    } catch (error) {
        console.error('[DB INIT ERROR]', error.message);
        console.error('Stack:', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = { pool, initDB };
