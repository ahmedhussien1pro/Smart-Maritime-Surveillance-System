const { v4: uuidv4 } = require('uuid');

let logs = [];
const MAX_LOGS = 1000;

function addLog({ type, message, severity = 'info' }) {
  const entry = {
    id: uuidv4(),
    type,
    message,
    severity, // info | warning | danger | success
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  if (logs.length > MAX_LOGS) logs = logs.slice(-MAX_LOGS);
  return entry;
}

function getLogs() {
  return [...logs];
}

function clearLogs() {
  logs = [];
}

module.exports = { addLog, getLogs, clearLogs };
