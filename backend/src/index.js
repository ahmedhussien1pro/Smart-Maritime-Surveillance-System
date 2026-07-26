require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { setupSocketHandlers } = require('./socket/handlers');
const { missionRouter } = require('./routes/mission');
const { logsRouter } = require('./routes/logs');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/mission', missionRouter);
app.use('/api/logs', logsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Smart Maritime Surveillance System',
    timestamp: new Date().toISOString(),
    mode: process.env.SIMULATION_MODE !== 'false' ? 'simulation' : 'hardware',
  });
});

// Socket.IO
setupSocketHandlers(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚢 Maritime Backend running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server active on port ${PORT}`);
});
