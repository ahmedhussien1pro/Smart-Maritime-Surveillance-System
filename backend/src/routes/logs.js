const express = require('express');
const { getLogs, clearLogs } = require('../services/logService');

const router = express.Router();

router.get('/', (req, res) => {
  const { limit = 100, severity } = req.query;
  let logs = getLogs();
  if (severity) logs = logs.filter(l => l.severity === severity);
  res.json(logs.slice(-Number(limit)));
});

router.delete('/', (req, res) => {
  clearLogs();
  res.json({ success: true });
});

module.exports = { logsRouter: router };
