const express = require('express');
const crypto = require('crypto'); // Built into Node 18 [cite: 363]
const { requireAuth } = require('../middleware/auth');
const { publishLog, consumeAllLogs } = require('../rabbitmq');

const router = express.Router();

// Apply the Keycloak gatekeeper to ALL routes in this file 
router.use(requireAuth);

// --- WRITE PATH: Publish a log ---
router.post('/', async (req, res) => {
  const { level, message } = req.body;

  // 1. Validation: Reject bad data before touching the broker [cite: 362]
  if (!level || !message) {
    return res.status(400).json({ error: 'Missing required fields: level and message' });
  }

  // 2. Construct the enterprise log object [cite: 352, 353]
  const logEntry = {
    id: crypto.randomUUID(),           // Unique trace ID [cite: 363]
    userId: req.user.sub,              // Extracted directly from the validated Keycloak JWT 
    level,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    // 3. Publish to RabbitMQ
    await publishLog(logEntry);
    res.status(201).json({ message: 'Log published successfully', log: logEntry }); [cite: 357]
  } catch (error) {
    console.error('Failed to publish log:', error);
    res.status(500).json({ error: 'Internal Server Error: Message Broker unavailable' }); [cite: 364]
  }
});

// --- READ PATH: Consume all logs ---
router.get('/', async (req, res) => {
  try {
    // Perform the destructive read [cite: 359, 360]
    const logs = await consumeAllLogs();
    res.status(200).json(logs); [cite: 359]
  } catch (error) {
    console.error('Failed to consume logs:', error);
    res.status(500).json({ error: 'Internal Server Error: Message Broker unavailable' }); [cite: 364]
  }
});

module.exports = router;
