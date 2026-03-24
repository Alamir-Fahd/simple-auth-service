const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { applicantId, income, debtAmount } = req.body;
  const client = req.app.locals.temporalClient;

  if (!applicantId || typeof income !== 'number' || typeof debtAmount !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid application data. applicantId must be a string, income and debtAmount must be numbers.' });
  }

  try {
    const workflowId = `screening-${applicantId}-${Date.now()}`;
    await client.workflow.start('screeningWorkflow', {
      args: [{ applicantId, income, debtAmount }],
      taskQueue: 'loan-screening',
      workflowId,
    });

    res.status(202).json({ 
      message: 'Screening started', 
      workflowId 
    });
  } catch (err) {
    console.error('Failed to start workflow:', err);
    res.status(500).json({ error: 'Failed to start screening' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = req.app.locals.temporalClient;

  try {
    const handle = client.workflow.getHandle(id);
    const result = await handle.result();
    
    res.status(200).json({ workflowId: id, decision: result });
  } catch (err) {
    if (err.name === 'WorkflowNotFoundError') {
      return res.status(404).json({ error: 'Workflow ID not found' });
    }
    console.error('Error fetching result:', err);
    res.status(500).json({ error: 'Error fetching workflow result' });
  }
});

module.exports = router;
