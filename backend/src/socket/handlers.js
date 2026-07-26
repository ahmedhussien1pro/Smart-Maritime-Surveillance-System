const { addLog } = require('../services/logService');

let boatState = {
  mode: 'AUTO',
  speed: 42,
  heading: 120,
  battery: 88,
  voltage: 12.4,
  solar: 65,
  wind: 18,
  hydro: 12,
  lat: 27.9654,
  lng: 34.3615,
  connected: true,
};

let aiState = {
  detected: false,
  class: 'Hostile Speedboat',
  confidence: 0.88,
  tracking: true,
  fps: 28,
  bbox: { x: 35, y: 25, width: 30, height: 40 },
};

let radarState = {
  sweepAngle: 0,
  targets: [
    { id: 'T-101', distance: 120, angle: 45, type: 'Enemy', threat: 'DANGER', speed: 18 },
    { id: 'T-102', distance: 280, angle: 210, type: 'Civilian', threat: 'NEUTRAL', speed: 12 },
  ],
};

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    const clientType = socket.handshake.query.type || 'dashboard';
    console.log(`[SOCKET] Connected: ${socket.id} (${clientType})`);

    socket.join(clientType);

    // Send current state on connect
    socket.emit('boat:state', boatState);
    socket.emit('ai:state', aiState);
    socket.emit('radar:state', radarState);

    // Handle dashboard commands
    socket.on('command', (data) => {
      console.log('[COMMAND RECEIVED]', data);
      
      const cmd = data.command;
      if (cmd === 'emergency_stop') {
        boatState.speed = 0;
        boatState.mode = 'MANUAL';
        addLog({ type: 'command', message: 'EMERGENCY STOP TRIGGERED', severity: 'danger' });
      } else if (cmd === 'forward') {
        boatState.speed = Math.min(100, boatState.speed + 10);
        addLog({ type: 'command', message: `Speed increased to ${boatState.speed}%`, severity: 'info' });
      } else if (cmd === 'backward') {
        boatState.speed = Math.max(0, boatState.speed - 10);
        addLog({ type: 'command', message: `Speed decreased to ${boatState.speed}%`, severity: 'info' });
      } else if (cmd === 'left') {
        boatState.heading = (boatState.heading - 15 + 360) % 360;
        addLog({ type: 'command', message: `Steered Left (Heading: ${boatState.heading}°)`, severity: 'info' });
      } else if (cmd === 'right') {
        boatState.heading = (boatState.heading + 15) % 360;
        addLog({ type: 'command', message: `Steered Right (Heading: ${boatState.heading}°)`, severity: 'info' });
      } else if (cmd === 'stop') {
        boatState.speed = 0;
        addLog({ type: 'command', message: 'Engine Stopped', severity: 'warning' });
      } else {
        addLog({ type: 'command', message: `Command: ${cmd}`, severity: 'info' });
      }

      // Forward to ESP room
      io.to('esp').emit('command', data);
      // ACK back to dashboard
      io.to('dashboard').emit('command:ack', { command: cmd, ts: Date.now(), boatState });
      io.to('dashboard').emit('boat:state', boatState);
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
        addLog({ type: 'detection', message: `Target detected: ${data.class} (${(data.confidence * 100).toFixed(0)}%)`, severity: 'danger' });
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

  // Simulation loop emit fake telemetry every 1.5s
  if (process.env.SIMULATION_MODE !== 'false') {
    startSimulation(io);
  }
}

function startSimulation(io) {
  console.log('[SIMULATION] Dynamic Maritime Simulation active...');
  let angleCounter = 0;

  setInterval(() => {
    angleCounter = (angleCounter + 5) % 360;

    // Simulate minor variations
    const speedVar = Math.floor(Math.sin(angleCounter * Math.PI / 180) * 10) + boatState.speed;
    const headingVar = (boatState.heading + Math.floor(Math.random() * 3 - 1) + 360) % 360;

    const simData = {
      ...boatState,
      speed: Math.max(0, Math.min(100, speedVar)),
      heading: headingVar,
      battery: Math.max(10, boatState.battery - 0.05),
      voltage: parseFloat((12.2 + Math.random() * 0.4).toFixed(1)),
      solar: Math.floor(Math.random() * 20 + 60),
      wind: Math.floor(Math.random() * 15 + 10),
      hydro: Math.floor(Math.random() * 10 + 5),
      lat: boatState.lat + 0.0001 * Math.cos(headingVar * Math.PI / 180),
      lng: boatState.lng + 0.0001 * Math.sin(headingVar * Math.PI / 180),
      connected: true,
    };
    boatState = simData;
    io.to('dashboard').emit('boat:state', simData);

    // AI Simulation
    const detected = Math.random() > 0.65;
    const aiSim = {
      detected,
      class: detected ? (Math.random() > 0.5 ? 'Hostile Speedboat' : 'Unidentified Vessel') : 'Clear',
      confidence: detected ? parseFloat((Math.random() * 0.25 + 0.72).toFixed(2)) : 0,
      tracking: detected,
      fps: Math.floor(Math.random() * 6 + 24),
      bbox: detected ? {
        x: Math.floor(Math.random() * 30 + 30),
        y: Math.floor(Math.random() * 30 + 20),
        width: Math.floor(Math.random() * 15 + 20),
        height: Math.floor(Math.random() * 15 + 20),
      } : null,
    };
    aiState = aiSim;
    io.to('dashboard').emit('ai:state', aiSim);

    if (detected && Math.random() > 0.8) {
      addLog({
        type: 'detection',
        message: `AI Alert: ${aiSim.class} detected with ${(aiSim.confidence * 100).toFixed(0)}% confidence`,
        severity: 'danger'
      });
      io.to('dashboard').emit('notification', {
        id: Date.now().toString(),
        title: 'Target Detection',
        message: `${aiSim.class} spotted in Sector 4`,
        severity: 'danger',
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // Radar simulation
    radarState.sweepAngle = (radarState.sweepAngle + 12) % 360;
    radarState.targets = [
      { id: 'T-101', distance: Math.floor(60 + Math.sin(angleCounter * 0.1) * 30), angle: (angleCounter + 45) % 360, type: 'Hostile Speedboat', threat: 'DANGER', speed: 24 },
      { id: 'T-102', distance: 180, angle: (310 - angleCounter / 2 + 360) % 360, type: 'Cargo Ship', threat: 'NEUTRAL', speed: 10 },
      { id: 'T-103', distance: 240, angle: (120 + angleCounter / 3) % 360, type: 'Patrol Boat', threat: 'FRIENDLY', speed: 15 },
    ];
    io.to('dashboard').emit('radar:state', radarState);

  }, 1500);
}

module.exports = { setupSocketHandlers };
