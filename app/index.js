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
let queue = [];
let counters = {
    1: { current: 0, name: 'Loket 1' },
    2: { current: 0, name: 'Loket 2' }
};
let nextNumber = 1;

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

// API Routes
app.post('/api/add-queue', (req, res) => {
    const { name } = req.body;
    const queueItem = {
        id: Date.now(),
        number: String(nextNumber++).padStart(3, '0'),
        name: name || `Antrian ${nextNumber - 1}`,
        timestamp: new Date()
    };
    
    queue.push(queueItem);
    
    // Broadcast ke semua client
    io.emit('queueUpdated', {
        queue: queue,
        counters: counters,
        total: queue.length
    });
    
    res.json({ success: true, queueItem });
});

app.post('/api/next-queue', (req, res) => {
    const { counter } = req.body;
    const counterId = counter || 1;
    
    if (queue.length > 0) {
        const nextItem = queue.shift();
        counters[counterId].current = nextItem.number;
        
        io.emit('queueUpdated', {
            queue: queue,
            counters: counters,
            total: queue.length,
            called: { ...nextItem, counter: counterId }
        });
        
        res.json({ success: true, called: nextItem, counter: counterId });
    } else {
        res.json({ success: false, message: 'Tidak ada antrian' });
    }
});

app.post('/api/recall-number', (req, res) => {
    console.log('Recall request received:', req.body);
    const { number, counter } = req.body;
    const counterId = counter || 1;
    
    console.log('Processing recall - number:', number, 'counter:', counterId);
    
    if (number && String(number).trim() !== '') {
        const formattedNumber = String(number).padStart(3, '0');
        counters[counterId].current = formattedNumber;
        
        console.log('Recall successful - formatted number:', formattedNumber);
        
        io.emit('queueUpdated', {
            queue: queue,
            counters: counters,
            total: queue.length,
            called: { number: formattedNumber, counter: counterId, recall: true }
        });
        
        res.json({ success: true, recalled: formattedNumber, counter: counterId });
    } else {
        console.log('Recall failed - invalid number');
        res.json({ success: false, message: 'Nomor tidak valid' });
    }
});

app.post('/api/reset-queue', (req, res) => {
    console.log('Reset queue request received');
    queue = [];
    counters = {
        1: { current: 0, name: 'Loket 1' },
        2: { current: 0, name: 'Loket 2' }
    };
    nextNumber = 1;
    
    io.emit('queueUpdated', {
        queue: queue,
        counters: counters,
        total: queue.length
    });
    
    console.log('Reset successful');
    res.json({ success: true, message: 'Antrian berhasil direset' });
});

app.get('/api/queue-status', (req, res) => {
    res.json({
        queue: queue,
        counters: counters,
        total: queue.length
    });
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Kirim status antrian saat client connect
    socket.emit('queueUpdated', {
        queue: queue,
        counters: counters,
        total: queue.length
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});