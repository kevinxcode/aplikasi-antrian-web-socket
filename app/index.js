const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { pool, initDB } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize database
initDB();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'antrian-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Akses ditolak' });
        }
    };
}

// Data antrian (in-memory untuk real-time)
let queueCS = [];
let queueTeller = [];
let counters = {
    cs1: { current: '000', name: 'CS 1', type: 'cs' },
    cs2: { current: '000', name: 'CS 2', type: 'cs' },
    t1: { current: '000', name: 'Teller 1', type: 'teller' },
    t2: { current: '000', name: 'Teller 2', type: 'teller' }
};
let nextNumberCS = 1;
let nextNumberTeller = 1;

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/ambil-nomor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ambil-nomor.html'));
});

app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

app.get('/settings', requireAuth, requireRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// API Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Username tidak ditemukan' });
        }
        
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.json({ success: false, message: 'Password salah' });
        }
        
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name
        };
        
        res.json({ success: true, redirect: '/admin' });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'Login gagal' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/user', requireAuth, (req, res) => {
    res.json({ user: req.session.user });
});

app.post('/api/update-profile', requireAuth, async (req, res) => {
    const { full_name } = req.body;
    const userId = req.session.user.id;
    
    try {
        await pool.query(
            'UPDATE users SET full_name = $1 WHERE id = $2',
            [full_name, userId]
        );
        
        req.session.user.full_name = full_name;
        res.json({ success: true, message: 'Profil berhasil diupdate' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.json({ success: false, message: 'Gagal update profil' });
    }
});

app.get('/api/display-settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM display_settings ORDER BY id DESC LIMIT 1');
        if (result.rows.length > 0) {
            res.json({ success: true, settings: result.rows[0] });
        } else {
            res.json({ success: true, settings: { marquee_text: 'Selamat Datang di Sistem Antrian', slide_images: [] } });
        }
    } catch (error) {
        console.error('Get display settings error:', error);
        res.json({ success: false, message: 'Gagal mengambil pengaturan' });
    }
});

app.post('/api/display-settings', requireAuth, requireRole('admin'), async (req, res) => {
    const { marquee_text, slide_images } = req.body;
    const userId = req.session.user.id;
    
    try {
        await pool.query(
            'UPDATE display_settings SET marquee_text = $1, slide_images = $2, updated_at = NOW(), updated_by = $3',
            [marquee_text, slide_images, userId]
        );
        
        io.emit('displaySettingsUpdated', { marquee_text, slide_images });
        res.json({ success: true, message: 'Pengaturan berhasil diupdate' });
    } catch (error) {
        console.error('Update display settings error:', error);
        res.json({ success: false, message: 'Gagal update pengaturan' });
    }
});

app.post('/api/upload-image', requireAuth, requireRole('admin'), async (req, res) => {
    const { image_data, filename } = req.body;
    
    try {
        const result = await pool.query('SELECT slide_images FROM display_settings ORDER BY id DESC LIMIT 1');
        let images = result.rows[0]?.slide_images || [];
        images.push(image_data);
        
        await pool.query(
            'UPDATE display_settings SET slide_images = $1, updated_at = NOW(), updated_by = $2',
            [images, req.session.user.id]
        );
        
        res.json({ success: true, message: 'Gambar berhasil diupload' });
    } catch (error) {
        console.error('Upload image error:', error);
        res.json({ success: false, message: 'Gagal upload gambar' });
    }
});

app.post('/api/delete-image', requireAuth, requireRole('admin'), async (req, res) => {
    const { index } = req.body;
    
    try {
        const result = await pool.query('SELECT slide_images FROM display_settings ORDER BY id DESC LIMIT 1');
        let images = result.rows[0]?.slide_images || [];
        images.splice(index, 1);
        
        await pool.query(
            'UPDATE display_settings SET slide_images = $1, updated_at = NOW(), updated_by = $2',
            [images, req.session.user.id]
        );
        
        io.emit('displaySettingsUpdated', { slide_images: images });
        res.json({ success: true, message: 'Gambar berhasil dihapus' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.json({ success: false, message: 'Gagal hapus gambar' });
    }
});

app.post('/api/add-queue', async (req, res) => {
    const { type, name } = req.body;
    
    let queueItem, queue, prefix;
    
    if (type === 'teller') {
        prefix = 'B';
        queueItem = {
            id: Date.now(),
            number: prefix + String(nextNumberTeller++).padStart(3, '0'),
            name: name || `Teller ${nextNumberTeller - 1}`,
            timestamp: new Date(),
            type: 'teller'
        };
        queueTeller.push(queueItem);
        queue = queueTeller;
    } else {
        prefix = 'A';
        queueItem = {
            id: Date.now(),
            number: prefix + String(nextNumberCS++).padStart(3, '0'),
            name: name || `CS ${nextNumberCS - 1}`,
            timestamp: new Date(),
            type: 'cs'
        };
        queueCS.push(queueItem);
        queue = queueCS;
    }
    
    // Save to database
    try {
        await pool.query(
            'INSERT INTO queue_transactions (queue_number, queue_type, customer_name, status) VALUES ($1, $2, $3, $4)',
            [queueItem.number, queueItem.type, queueItem.name, 'waiting']
        );
    } catch (error) {
        console.error('Database error:', error);
    }
    
    io.emit('queueUpdated', {
        queueCS: queueCS,
        queueTeller: queueTeller,
        counters: counters,
        totalCS: queueCS.length,
        totalTeller: queueTeller.length
    });
    
    res.json({ success: true, queueItem });
});

app.post('/api/next-queue', requireAuth, async (req, res) => {
    const { counter } = req.body;
    const counterInfo = counters[counter];
    const user = req.session.user;
    
    if (!counterInfo) {
        return res.json({ success: false, message: 'Counter tidak valid' });
    }
    
    // Check role permission
    if (user.role === 'cs' && counterInfo.type !== 'cs') {
        return res.json({ success: false, message: 'Anda hanya bisa memanggil antrian CS' });
    }
    if (user.role === 'teller' && counterInfo.type !== 'teller') {
        return res.json({ success: false, message: 'Anda hanya bisa memanggil antrian Teller' });
    }
    
    const queue = counterInfo.type === 'cs' ? queueCS : queueTeller;
    
    if (queue.length > 0) {
        const nextItem = queue.shift();
        counters[counter].current = nextItem.number;
        
        // Update database
        try {
            await pool.query(
                'UPDATE queue_transactions SET status = $1, counter = $2, called_by = $3, called_at = NOW(), called_by_name = $4 WHERE queue_number = $5',
                ['called', counter, user.id, user.full_name || user.username, nextItem.number]
            );
        } catch (error) {
            console.error('Database error:', error);
        }
        
        io.emit('queueUpdated', {
            queueCS: queueCS,
            queueTeller: queueTeller,
            counters: counters,
            totalCS: queueCS.length,
            totalTeller: queueTeller.length,
            called: { ...nextItem, counter: counter, counterName: counterInfo.name }
        });
        
        res.json({ success: true, called: nextItem, counter: counter });
    } else {
        res.json({ success: false, message: 'Tidak ada antrian' });
    }
});

app.post('/api/recall-number', requireAuth, async (req, res) => {
    const { number, counter } = req.body;
    const counterInfo = counters[counter];
    const user = req.session.user;
    
    if (!counterInfo) {
        return res.json({ success: false, message: 'Counter tidak valid' });
    }
    
    if (number && String(number).trim() !== '') {
        counters[counter].current = number;
        
        // Update database
        try {
            await pool.query(
                'UPDATE queue_transactions SET called_by = $1, called_at = NOW(), called_by_name = $2 WHERE queue_number = $3',
                [user.id, user.full_name || user.username, number]
            );
        } catch (error) {
            console.error('Database error:', error);
        }
        
        io.emit('queueUpdated', {
            queueCS: queueCS,
            queueTeller: queueTeller,
            counters: counters,
            totalCS: queueCS.length,
            totalTeller: queueTeller.length,
            called: { number: number, counter: counter, counterName: counterInfo.name, recall: true }
        });
        
        res.json({ success: true, recalled: number, counter: counter });
    } else {
        res.json({ success: false, message: 'Nomor tidak valid' });
    }
});

app.post('/api/reset-queue', requireAuth, requireRole('admin'), async (req, res) => {
    queueCS = [];
    queueTeller = [];
    counters = {
        cs1: { current: '000', name: 'CS 1', type: 'cs' },
        cs2: { current: '000', name: 'CS 2', type: 'cs' },
        t1: { current: '000', name: 'Teller 1', type: 'teller' },
        t2: { current: '000', name: 'Teller 2', type: 'teller' }
    };
    nextNumberCS = 1;
    nextNumberTeller = 1;
    
    io.emit('queueUpdated', {
        queueCS: queueCS,
        queueTeller: queueTeller,
        counters: counters,
        totalCS: queueCS.length,
        totalTeller: queueTeller.length
    });
    
    res.json({ success: true, message: 'Antrian berhasil direset' });
});

app.get('/api/queue', (req, res) => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16).replace('T', ' ');
    
    res.json({
        cs1: counters.cs1.current,
        cs2: counters.cs2.current,
        t1: counters.t1.current,
        t2: counters.t2.current,
        updated: formatted
    });
});

app.get('/api/queue-status', (req, res) => {
    res.json({
        queueCS: queueCS,
        queueTeller: queueTeller,
        counters: counters,
        totalCS: queueCS.length,
        totalTeller: queueTeller.length
    });
});

// Get transaction history (admin only)
app.get('/api/transactions', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT qt.*, u.username as called_by_username, u.full_name as called_by_fullname 
            FROM queue_transactions qt 
            LEFT JOIN users u ON qt.called_by = u.id 
            ORDER BY qt.created_at DESC 
            LIMIT 100
        `);
        res.json({ success: true, transactions: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.json({ success: false, message: 'Gagal mengambil data' });
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.emit('queueUpdated', {
        queueCS: queueCS,
        queueTeller: queueTeller,
        counters: counters,
        totalCS: queueCS.length,
        totalTeller: queueTeller.length
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
