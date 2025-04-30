const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { auth } = require('../middleware/auth');

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const filters = {
      client_id: req.query.client_id,
      project_id: req.query.project_id,
      status: req.query.status,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      created_by: req.query.all ? null : req.user.id
    };
    
    const invoices = await Invoice.findAll(filters);
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Get invoice statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const filters = {
      client_id: req.query.client_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      created_by: req.query.all ? null : req.user.id
    };
    
    const stats = await Invoice.getStats(filters);
    res.json(stats);
  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({ message: 'Error fetching invoice statistics' });
  }
});

// Get invoice by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Error fetching invoice' });
  }
});

// Create new invoice
router.post('/', auth, async (req, res) => {
  try {
    const invoiceData = {
      ...req.body,
      created_by: req.user.id
    };
    
    const invoiceId = await Invoice.create(invoiceData);
    const invoice = await Invoice.findById(invoiceId);
    
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const success = await Invoice.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    const invoice = await Invoice.findById(req.params.id);
    res.json(invoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Error updating invoice' });
  }
});

// Update invoice status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const payment_date = status === 'paid' ? new Date() : null;
    const success = await Invoice.updateStatus(req.params.id, status, payment_date);
    
    if (!success) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    const invoice = await Invoice.findById(req.params.id);
    res.json(invoice);
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ message: 'Error updating invoice status' });
  }
});

// Delete invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await Invoice.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Error deleting invoice' });
  }
});

module.exports = router; 