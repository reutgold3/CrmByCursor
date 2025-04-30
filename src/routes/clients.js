const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { auth } = require('../middleware/auth');

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      created_by: req.query.all ? null : req.user.id
    };
    
    const clients = await Client.findAll(filters);
    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
});

// Get client by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Error fetching client' });
  }
});

// Create new client
router.post('/', auth, async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      created_by: req.user.id
    };
    
    const clientId = await Client.create(clientData);
    const client = await Client.findById(clientId);
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Error creating client' });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const success = await Client.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const client = await Client.findById(req.params.id);
    res.json(client);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Error updating client' });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await Client.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

// Get client's projects
router.get('/:id/projects', auth, async (req, res) => {
  try {
    const projects = await Client.getClientProjects(req.params.id);
    res.json(projects);
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({ message: 'Error fetching client projects' });
  }
});

// Get client's invoices
router.get('/:id/invoices', auth, async (req, res) => {
  try {
    const invoices = await Client.getClientInvoices(req.params.id);
    res.json(invoices);
  } catch (error) {
    console.error('Get client invoices error:', error);
    res.status(500).json({ message: 'Error fetching client invoices' });
  }
});

module.exports = router; 