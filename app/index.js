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

// Initialize database and load last queue numbers
initDB().then(() => {
    loadLastQueueNumbers();
    startDailyReset();
});

// Auto-reset queue every day at 00:00
function startDailyReset() {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();
    
    setTimeout(() => {
        resetDailyQueue();
        setInterval(resetDailyQueue, 24 * 60 * 60 * 1000);
    }, msToMidnight);
    
    console.log(`Daily auto-reset scheduled at 00:00 (in ${Math.round(msToMidnight / 1000 / 60)} minutes)`);
}

function resetDailyQueue() {
    console.log('Auto-reset: Starting daily queue reset at 00:00');
    
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
    
    console.log('Auto-reset: Queue reset completed, ready for new day');
}

// Middleware
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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

// Load last queue numbers and current counter display from database
async function loadLastQueueNumbers() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Clear memory first
        queueCS = [];
        queueTeller = [];
        
        // Load waiting queues from database
        const waitingQueues = await pool.query(
            "SELECT * FROM queue_transactions WHERE status = 'waiting' AND DATE(created_at) = $1 ORDER BY created_at ASC",
            [today]
        );
        
        waitingQueues.rows.forEach(row => {
            const queueItem = {
                id: row.id,
                number: row.queue_number,
                name: row.customer_name,
                timestamp: row.created_at,
                type: row.queue_type
            };
            
            if (row.queue_type === 'cs') {
                queueCS.push(queueItem);
            } else if (row.queue_type === 'teller') {
                queueTeller.push(queueItem);
            }
        });
        
        console.log(`Loaded ${queueCS.length} CS queues and ${queueTeller.length} Teller queues from database`);
        
        // Get last CS number
        const csResult = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE queue_type = 'cs' AND DATE(created_at) = $1 ORDER BY created_at DESC LIMIT 1",
            [today]
        );
        if (csResult.rows.length > 0) {
            const lastNumber = parseInt(csResult.rows[0].queue_number.substring(1));
            nextNumberCS = lastNumber + 1;
            console.log(`Loaded last CS number: A${String(lastNumber).padStart(3, '0')}, next will be: A${String(nextNumberCS).padStart(3, '0')}`);
        } else {
            nextNumberCS = 1;
            console.log('No CS transactions today, starting from A001');
        }
        
        // Get last Teller number
        const tellerResult = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE queue_type = 'teller' AND DATE(created_at) = $1 ORDER BY created_at DESC LIMIT 1",
            [today]
        );
        if (tellerResult.rows.length > 0) {
            const lastNumber = parseInt(tellerResult.rows[0].queue_number.substring(1));
            nextNumberTeller = lastNumber + 1;
            console.log(`Loaded last Teller number: B${String(lastNumber).padStart(3, '0')}, next will be: B${String(nextNumberTeller).padStart(3, '0')}`);
        } else {
            nextNumberTeller = 1;
            console.log('No Teller transactions today, starting from B001');
        }
        
        // Load current display numbers for each counter
        const cs1Result = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE counter = 'cs1' AND DATE(called_at) = $1 ORDER BY called_at DESC LIMIT 1",
            [today]
        );
        if (cs1Result.rows.length > 0) {
            counters.cs1.current = cs1Result.rows[0].queue_number;
            console.log(`Loaded CS1 display: ${counters.cs1.current}`);
        }
        
        const cs2Result = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE counter = 'cs2' AND DATE(called_at) = $1 ORDER BY called_at DESC LIMIT 1",
            [today]
        );
        if (cs2Result.rows.length > 0) {
            counters.cs2.current = cs2Result.rows[0].queue_number;
            console.log(`Loaded CS2 display: ${counters.cs2.current}`);
        }
        
        const t1Result = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE counter = 't1' AND DATE(called_at) = $1 ORDER BY called_at DESC LIMIT 1",
            [today]
        );
        if (t1Result.rows.length > 0) {
            counters.t1.current = t1Result.rows[0].queue_number;
            console.log(`Loaded Teller1 display: ${counters.t1.current}`);
        }
        
        const t2Result = await pool.query(
            "SELECT queue_number FROM queue_transactions WHERE counter = 't2' AND DATE(called_at) = $1 ORDER BY called_at DESC LIMIT 1",
            [today]
        );
        if (t2Result.rows.length > 0) {
            counters.t2.current = t2Result.rows[0].queue_number;
            console.log(`Loaded Teller2 display: ${counters.t2.current}`);
        }
        
        console.log('Queue numbers, counter displays, and waiting queues loaded from database');
    } catch (error) {
        console.error('Error loading queue numbers:', error);
    }
}

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

app.get('/cs1', requireAuth, (req, res) => {
    if (req.session.user.role !== 'cs') {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'counter.html'));
});

app.get('/cs2', requireAuth, (req, res) => {
    if (req.session.user.role !== 'cs') {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'counter.html'));
});

app.get('/teller1', requireAuth, (req, res) => {
    if (req.session.user.role !== 'teller') {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'counter.html'));
});

app.get('/teller2', requireAuth, (req, res) => {
    if (req.session.user.role !== 'teller') {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'counter.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

app.get('/display-slide', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display-slide.html'));
});

app.get('/settings', requireAuth, requireRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/slides', requireAuth, requireRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'slides.html'));
});

app.get('/users', requireAuth, requireRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
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
            full_name: user.full_name,
            counter_access: user.counter_access
        };
        
        // Redirect based on counter_access
        let redirect = '/admin';
        if (user.counter_access === 'cs1') redirect = '/cs1';
        else if (user.counter_access === 'cs2') redirect = '/cs2';
        else if (user.counter_access === 't1') redirect = '/teller1';
        else if (user.counter_access === 't2') redirect = '/teller2';
        
        res.json({ success: true, redirect });
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

// Get all users (admin only)
app.get('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, role, full_name, counter_access, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users: result.rows });
    } catch (error) {
        console.error('Get users error:', error);
        res.json({ success: false, message: 'Gagal mengambil data user' });
    }
});

// Add new user (admin only)
app.post('/api/add-user', requireAuth, requireRole('admin'), async (req, res) => {
    const { username, password, role, full_name, counter_access } = req.body;
    
    if (!username || !password || !role) {
        return res.json({ success: false, message: 'Username, password, dan role harus diisi' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password, role, full_name, counter_access) VALUES ($1, $2, $3, $4, $5)',
            [username, hashedPassword, role, full_name, counter_access]
        );
        res.json({ success: true, message: 'User berhasil ditambahkan' });
    } catch (error) {
        if (error.code === '23505') {
            res.json({ success: false, message: 'Username sudah digunakan' });
        } else {
            console.error('Add user error:', error);
            res.json({ success: false, message: 'Gagal menambahkan user' });
        }
    }
});

// Update user (admin only)
app.post('/api/update-user', requireAuth, requireRole('admin'), async (req, res) => {
    const { userId, username, password, role, full_name, counter_access } = req.body;
    
    if (!userId || !username || !role) {
        return res.json({ success: false, message: 'Data tidak lengkap' });
    }
    
    try {
        if (password && password.trim()) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE users SET username = $1, password = $2, role = $3, full_name = $4, counter_access = $5 WHERE id = $6',
                [username, hashedPassword, role, full_name, counter_access, userId]
            );
        } else {
            await pool.query(
                'UPDATE users SET username = $1, role = $2, full_name = $3, counter_access = $4 WHERE id = $5',
                [username, role, full_name, counter_access, userId]
            );
        }
        res.json({ success: true, message: 'User berhasil diupdate' });
    } catch (error) {
        if (error.code === '23505') {
            res.json({ success: false, message: 'Username sudah digunakan' });
        } else {
            console.error('Update user error:', error);
            res.json({ success: false, message: 'Gagal update user' });
        }
    }
});

// Delete user (admin only)
app.post('/api/delete-user', requireAuth, requireRole('admin'), async (req, res) => {
    const { userId } = req.body;
    
    if (userId === req.session.user.id) {
        return res.json({ success: false, message: 'Tidak bisa menghapus user sendiri' });
    }
    
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.json({ success: false, message: 'Gagal menghapus user' });
    }
});

app.get('/api/display-settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM display_settings ORDER BY id DESC LIMIT 1');
        
        if (result.rows.length > 0) {
            res.json({ success: true, settings: result.rows[0] });
        } else {
            res.json({ success: true, settings: { marquee_text: 'Selamat Datang di Sistem Antrian' } });
        }
    } catch (error) {
        console.error('Get display settings error:', error);
        res.json({ success: false, message: 'Gagal mengambil pengaturan' });
    }
});

app.post('/api/display-settings', requireAuth, requireRole('admin'), async (req, res) => {
    const { marquee_text } = req.body;
    const userId = req.session.user.id;
    
    try {
        await pool.query(
            'UPDATE display_settings SET marquee_text = $1, updated_at = NOW(), updated_by = $2',
            [marquee_text, userId]
        );
        
        io.emit('displaySettingsUpdated', { marquee_text });
        res.json({ success: true, message: 'Pengaturan berhasil diupdate' });
    } catch (error) {
        console.error('Update display settings error:', error);
        res.json({ success: false, message: 'Gagal update pengaturan' });
    }
});

app.post('/api/upload-image', requireAuth, requireRole('admin'), async (req, res) => {
    const { image_data } = req.body;
    
    try {
        const maxOrder = await pool.query('SELECT COALESCE(MAX(display_order), 0) as max_order FROM image_slides');
        const nextOrder = parseInt(maxOrder.rows[0].max_order) + 1;
        
        await pool.query(
            'INSERT INTO image_slides (image_data, display_order, created_by) VALUES ($1, $2, $3)',
            [image_data, nextOrder, req.session.user.id]
        );
        
        io.emit('slidesUpdated');
        res.json({ success: true, message: 'Gambar berhasil diupload' });
    } catch (error) {
        console.error('Upload image error:', error);
        res.json({ success: false, message: 'Gagal upload gambar' });
    }
});

app.post('/api/delete-image', requireAuth, requireRole('admin'), async (req, res) => {
    const { imageId } = req.body;
    
    try {
        await pool.query('DELETE FROM image_slides WHERE id = $1', [imageId]);
        
        io.emit('slidesUpdated');
        res.json({ success: true, message: 'Gambar berhasil dihapus' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.json({ success: false, message: 'Gagal hapus gambar' });
    }
});

app.get('/api/image-slides', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM image_slides ORDER BY display_order ASC, id ASC');
        res.json({ success: true, slides: result.rows });
    } catch (error) {
        console.error('Get image slides error:', error);
        res.json({ success: false, message: 'Gagal mengambil gambar' });
    }
});

app.get('/api/premium-status', async (req, res) => {
    try {
        const result = await pool.query('SELECT is_activated FROM premium_activation LIMIT 1');
        res.json({ success: true, is_activated: result.rows[0]?.is_activated || false });
    } catch (error) {
        console.error('Get premium status error:', error);
        res.json({ success: false, message: 'Gagal mengambil status premium' });
    }
});

app.post('/api/activate-premium', requireAuth, requireRole('admin'), async (req, res) => {
    const { passcode } = req.body;
    
    try {
        const result = await pool.query('SELECT id, passcode_hash FROM premium_passcode LIMIT 1');
        
        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Passcode tidak ditemukan' });
        }
        
        const match = await bcrypt.compare(passcode, result.rows[0].passcode_hash);
        
        if (!match) {
            return res.json({ success: false, message: 'Passcode salah' });
        }
        
        await pool.query(
            'UPDATE premium_activation SET is_activated = TRUE, passcode_id = $1, activated_at = NOW(), activated_by = $2',
            [result.rows[0].id, req.session.user.id]
        );
        
        io.emit('premiumActivated');
        res.json({ success: true, message: 'Premium berhasil diaktifkan' });
    } catch (error) {
        console.error('Activate premium error:', error);
        res.json({ success: false, message: 'Gagal aktivasi premium' });
    }
});

app.post('/api/add-queue', async (req, res) => {
    const { type, name } = req.body;
    
    try {
        const today = new Date().toISOString().split('T')[0];
        let prefix, queueType, nextNumber;
        
        if (type === 'teller') {
            prefix = 'B';
            queueType = 'teller';
            
            // Get last number from database
            const result = await pool.query(
                "SELECT queue_number FROM queue_transactions WHERE queue_type = 'teller' AND DATE(created_at) = $1 ORDER BY created_at DESC LIMIT 1",
                [today]
            );
            
            if (result.rows.length > 0) {
                nextNumber = parseInt(result.rows[0].queue_number.substring(1)) + 1;
            } else {
                nextNumber = 1;
            }
        } else {
            prefix = 'A';
            queueType = 'cs';
            
            // Get last number from database
            const result = await pool.query(
                "SELECT queue_number FROM queue_transactions WHERE queue_type = 'cs' AND DATE(created_at) = $1 ORDER BY created_at DESC LIMIT 1",
                [today]
            );
            
            if (result.rows.length > 0) {
                nextNumber = parseInt(result.rows[0].queue_number.substring(1)) + 1;
            } else {
                nextNumber = 1;
            }
        }
        
        const queueNumber = prefix + String(nextNumber).padStart(3, '0');
        const customerName = name || `${queueType === 'cs' ? 'CS' : 'Teller'} ${nextNumber}`;
        
        // Save to database
        await pool.query(
            'INSERT INTO queue_transactions (queue_number, queue_type, customer_name, status) VALUES ($1, $2, $3, $4)',
            [queueNumber, queueType, customerName, 'waiting']
        );
        
        // Add to memory for real-time
        const queueItem = {
            id: Date.now(),
            number: queueNumber,
            name: customerName,
            timestamp: new Date(),
            type: queueType
        };
        
        if (queueType === 'teller') {
            queueTeller.push(queueItem);
        } else {
            queueCS.push(queueItem);
        }
        
        io.emit('queueUpdated', {
            queueCS: queueCS,
            queueTeller: queueTeller,
            counters: counters,
            totalCS: queueCS.length,
            totalTeller: queueTeller.length
        });
        
        res.json({ success: true, queueItem });
    } catch (error) {
        console.error('Add queue error:', error);
        res.json({ success: false, message: 'Gagal menambah antrian' });
    }
});

app.post('/api/next-queue', requireAuth, async (req, res) => {
    const { counter } = req.body;
    const counterInfo = counters[counter];
    const user = req.session.user;
    
    if (!counterInfo) {
        return res.json({ success: false, message: 'Counter tidak valid' });
    }
    
    // Check permission based on counter_access
    if (user.role !== 'admin' && user.counter_access && user.counter_access !== counter) {
        const counterNames = { cs1: 'CS 1', cs2: 'CS 2', t1: 'Teller 1', t2: 'Teller 2' };
        return res.json({ 
            success: false, 
            message: `Anda hanya bisa memanggil antrian ke ${counterNames[user.counter_access]}` 
        });
    }
    
    const queue = counterInfo.type === 'cs' ? queueCS : queueTeller;
    
    // Validate queue type matches counter type for next queue
    if (queue.length > 0) {
        const nextItem = queue[0];
        if (counterInfo.type === 'cs' && nextItem.type !== 'cs') {
            return res.json({ success: false, message: 'Counter CS hanya bisa memanggil antrian CS (nomor A). Gunakan panggil ulang untuk nomor B.' });
        }
        if (counterInfo.type === 'teller' && nextItem.type !== 'teller') {
            return res.json({ success: false, message: 'Counter Teller hanya bisa memanggil antrian Teller (nomor B). Gunakan panggil ulang untuk nomor A.' });
        }
    }
    
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
        const numStr = String(number).trim().toUpperCase();
        counters[counter].current = numStr;
        
        // Update database
        try {
            await pool.query(
                'UPDATE queue_transactions SET called_by = $1, called_at = NOW(), called_by_name = $2 WHERE queue_number = $3',
                [user.id, user.full_name || user.username, numStr]
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
            called: { number: numStr, counter: counter, counterName: counterInfo.name, recall: true }
        });
        
        res.json({ success: true, recalled: numStr, counter: counter });
    } else {
        res.json({ success: false, message: 'Nomor tidak valid' });
    }
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

// Reload queue from database (admin only)
app.post('/api/reload-queue', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        await loadLastQueueNumbers();
        
        io.emit('queueUpdated', {
            queueCS: queueCS,
            queueTeller: queueTeller,
            counters: counters,
            totalCS: queueCS.length,
            totalTeller: queueTeller.length
        });
        
        res.json({ 
            success: true, 
            message: 'Data berhasil di-reload dari database',
            nextCS: `A${String(nextNumberCS).padStart(3, '0')}`,
            nextTeller: `B${String(nextNumberTeller).padStart(3, '0')}`
        });
    } catch (error) {
        console.error('Reload queue error:', error);
        res.json({ success: false, message: 'Gagal reload data' });
    }
});

// Get transaction history
app.get('/api/transactions', requireAuth, async (req, res) => {
    const user = req.session.user;
    const { startDate, endDate, counter, type } = req.query;
    
    try {
        let query = `
            SELECT qt.*, u.username as called_by_username, u.full_name as called_by_fullname 
            FROM queue_transactions qt 
            LEFT JOIN users u ON qt.called_by = u.id 
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;
        
        if (startDate) {
            query += ` AND qt.created_at >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }
        if (endDate) {
            query += ` AND qt.created_at <= $${paramCount}`;
            params.push(endDate + ' 23:59:59');
            paramCount++;
        }
        if (counter) {
            query += ` AND qt.counter = $${paramCount}`;
            params.push(counter);
            paramCount++;
        }
        if (type) {
            query += ` AND qt.queue_type = $${paramCount}`;
            params.push(type);
            paramCount++;
        }
        
        // No filter for counter_access - allow all users to see all transactions
        
        query += ' ORDER BY qt.created_at DESC LIMIT 1000';
        
        const result = await pool.query(query, params);
        res.json({ success: true, transactions: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.json({ success: false, message: 'Gagal mengambil data' });
    }
});

// Export transactions to CSV (admin only)
app.get('/api/export-transactions', requireAuth, requireRole('admin'), async (req, res) => {
    const { startDate, endDate, counter, type } = req.query;
    
    try {
        let query = `
            SELECT 
                qt.queue_number,
                qt.queue_type,
                qt.customer_name,
                qt.counter,
                qt.status,
                qt.called_by_name,
                TO_CHAR(qt.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                TO_CHAR(qt.called_at, 'YYYY-MM-DD HH24:MI:SS') as called_at
            FROM queue_transactions qt 
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;
        
        if (startDate) {
            query += ` AND qt.created_at >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }
        if (endDate) {
            query += ` AND qt.created_at <= $${paramCount}`;
            params.push(endDate + ' 23:59:59');
            paramCount++;
        }
        if (counter) {
            query += ` AND qt.counter = $${paramCount}`;
            params.push(counter);
            paramCount++;
        }
        if (type) {
            query += ` AND qt.queue_type = $${paramCount}`;
            params.push(type);
            paramCount++;
        }
        
        query += ' ORDER BY qt.created_at DESC';
        
        const result = await pool.query(query, params);
        
        // Generate CSV
        let csv = 'Nomor Antrian,Tipe,Nama Customer,Counter,Status,Dipanggil Oleh,Waktu Dibuat,Waktu Dipanggil\n';
        result.rows.forEach(row => {
            csv += `${row.queue_number},${row.queue_type},${row.customer_name || ''},${row.counter || ''},${row.status},${row.called_by_name || ''},${row.created_at || ''},${row.called_at || ''}\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=antrian-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Gagal export data' });
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
    console.log(`Current date: ${new Date().toISOString().split('T')[0]}`);
});

module.exports = { app, server, io };
