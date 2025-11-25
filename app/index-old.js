const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Data antrian
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
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/ambil-nomor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ambil-nomor.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

// API Routes
app.post('/api/add-queue', (req, res) => {
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
    
    io.emit('queueUpdated', {
        queueCS: queueCS,
        queueTeller: queueTeller,
        counters: counters,
        totalCS: queueCS.length,
        totalTeller: queueTeller.length
    });
    
    res.json({ success: true, queueItem });
});

app.post('/api/next-queue', (req, res) => {
    const { counter } = req.body;
    const counterInfo = counters[counter];
    
    if (!counterInfo) {
        return res.json({ success: false, message: 'Counter tidak valid' });
    }
    
    const queue = counterInfo.type === 'cs' ? queueCS : queueTeller;
    
    if (queue.length > 0) {
        const nextItem = queue.shift();
        counters[counter].current = nextItem.number;
        
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

app.post('/api/recall-number', (req, res) => {
    const { number, counter } = req.body;
    const counterInfo = counters[counter];
    
    if (!counterInfo) {
        return res.json({ success: false, message: 'Counter tidak valid' });
    }
    
    if (number && String(number).trim() !== '') {
        counters[counter].current = number;
        
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

app.post('/api/reset-queue', (req, res) => {
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