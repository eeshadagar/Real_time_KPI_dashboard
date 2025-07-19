const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/Database');
const kpiRoutes = require('./routes/kpi');
const KPI = require('./models/KPI');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/kpis', kpiRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Emit KPI data every 3 seconds
setInterval(async () => {
  try {
    const kpis = await KPI.find().sort({ lastUpdated: -1 });
    io.emit('kpiData', kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
  }
}, 3000);

// Simulate random data updates (for demo purposes)
setInterval(async () => {
  try {
    const kpis = await KPI.find();
    if (kpis.length > 0) {
      const randomKPI = kpis[Math.floor(Math.random() * kpis.length)];
      const newValue = Math.floor(Math.random() * 1000) + 50;
      
      await KPI.findByIdAndUpdate(randomKPI._id, {
        value: newValue,
        lastUpdated: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating random KPI:', error);
  }
}, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});