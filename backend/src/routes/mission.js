const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const MISSION_FILE = path.join(__dirname, '../../data/mission.json');

const DEFAULT_MISSION = {
  name: 'Default Mission',
  enemyColor: 'red',
  trackingSpeed: 40,
  boatSpeed: 70,
  confidence: 0.85,
  alarmTime: 15,
  stopDistance: 30,
  searchRadius: 100,
  target: { x: 600, y: 250 },
  startPos: { x: 0, y: 0 },
  simulationMode: true,
};

router.get('/', (req, res) => {
  try {
    if (fs.existsSync(MISSION_FILE)) {
      const mission = JSON.parse(fs.readFileSync(MISSION_FILE, 'utf-8'));
      res.json(mission);
    } else {
      res.json(DEFAULT_MISSION);
    }
  } catch {
    res.json(DEFAULT_MISSION);
  }
});

router.post('/', (req, res) => {
  try {
    const dir = path.dirname(MISSION_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const mission = { ...DEFAULT_MISSION, ...req.body };
    fs.writeFileSync(MISSION_FILE, JSON.stringify(mission, null, 2));
    res.json({ success: true, mission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { missionRouter: router };
