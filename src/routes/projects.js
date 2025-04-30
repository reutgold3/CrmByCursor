const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const filters = {
      client_id: req.query.client_id,
      status: req.query.status,
      search: req.query.search,
      created_by: req.query.all ? null : req.user.id
    };
    
    const projects = await Project.findAll(filters);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      created_by: req.user.id
    };
    
    const projectId = await Project.create(projectData);
    const project = await Project.findById(projectId);
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const success = await Project.update(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Update project status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const success = await Project.updateStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Error updating project status' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const success = await Project.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Get project's invoices
router.get('/:id/invoices', auth, async (req, res) => {
  try {
    const invoices = await Project.getProjectInvoices(req.params.id);
    res.json(invoices);
  } catch (error) {
    console.error('Get project invoices error:', error);
    res.status(500).json({ message: 'Error fetching project invoices' });
  }
});

module.exports = router; 