const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const contractService = require('../services/contractService');
const Project = require('../models/Project');
const Client = require('../models/Client');

// Send project contract
router.post('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const client = await Client.findById(project.client_id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const contractData = {
      date: new Date().toLocaleDateString(),
      project,
      client
    };

    await contractService.generateAndSendContract(
      'project_contract',
      contractData,
      client.email,
      `Project Contract - ${project.name}`
    );

    res.json({ message: 'Contract sent successfully' });
  } catch (error) {
    console.error('Send contract error:', error);
    res.status(500).json({ message: 'Error sending contract' });
  }
});

module.exports = router; 