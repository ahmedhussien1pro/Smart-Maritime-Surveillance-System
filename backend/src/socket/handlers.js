const { addLog } = require('../services/logService');

let boatState = {
  mode: 'AUTO',
  speed: 0,
  heading: 0,
  battery: 100,
  connected: false,
};

let aiState = {
  detected: false,
  class: null,
  confidence: 0,
  tracking: false,
  fps: 0,
};

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    const clientType = socket.handshake.query.type || 'dashboard';
    console.log(`[SOCKET] Connected: ${socket.id} (${clientType})`);

    socket.join(clientType);

    // Send current state on connect
    socket.emit('boat:state', boatState);
    socket.emit('ai:state', aiState);

    // Handle dashboard commands
    socket.on('command', (data) => {
      console.log('[COMMAND]', data);
      addLog({ type: 'command', message: `Command: ${data.command}`, severity: 'info' });
      // Forward to ESP room
      io.to('esp').emit('command', data);
      io.to('dashboard').emit('command:ack', { command: data.command, ts: Date.now() });
    });

    // Handle ESP telemetry
    socket.on('esp:telemetry', (data) => {
      boatState = { ...boatState, ...data, connected: true };
      io.to('dashboard').emit('boat:state', boatState);
    });

    // Handle AI detections
    socket.on('ai:detection', (data) => {
      aiState = { ...aiState, ...data };
      io.to('dashboard').emit('ai:state', aiState);
      if (data.detected) {
        addLog({ type: 'detection', message: `Enemy detected: ${data.class} (${(data.confidence * 100).toFixed(0)}%)`, severity: 'danger' });
        io.to('dashboard').emit('notification', { type: 'enemy_detected', data });
      }
    });

    socket.on('disconnect', () => {
      if (clientType === 'esp') {
        boatState.connected = false;
        io.to('dashboard').emit('boat:state', boatState);
        addLog({ type: 'connection', message: 'ESP module disconnected', severity: 'warning' });
      }
      console.log(`[SOCKET] Disconnected: ${socket.id}`);
    });
  });

  // Simulation mode: emit fake data every 2s
  if (process.env.SIMULATION_MODE !== 'false') {
    startSimulation(io);
  }
}

function startSimulation(io) {
  console.log('[SIMULATION] Starting simulation mode...');
  setInterval(() => {
    const simData = {
      mode: Math.random() > 0.3 ? 'AUTO' : 'MANUAL',
      speed: Math.floor(Math.random() * 80 + 10),
      heading: Math.floor(Math.random() * 360),
      battery: Math.floor(Math.random() * 60 + 30),
      voltage: parseFloat((Math.random() * 2 + 11).toFixed(1)),
      solar: Math.floor(Math.random() * 80 + 20),
      wind: Math.floor(Math.random() * 30 + 5),
      hydro: Math.floor(Math.random() * 20 + 5),
      connected: true,
    };
    boatState = { ...boatState, ...simData };
    io.to('dashboard').emit('boat:state', simData);

    const aiSim = {
      detected: Math.random() > 0.88,
      class: 'Enemy',
      confidence: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
      tracking: Math.random() > 0.6,
      fps: Math.floor(Math.random() * 15 + 20),
    };
    aiState = aiSim;
    io.to('dashboard').emit('ai:state', aiSim);
  }, 2000);
}

module.exports = { setupSocketHandlers };
