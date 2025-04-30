const db = require('../config/database');

class Project {
  static async create(projectData) {
    const [result] = await db.query(
      `INSERT INTO projects 
       (name, description, client_id, status, start_date, end_date, budget, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectData.name,
        projectData.description,
        projectData.client_id,
        projectData.status || 'pending',
        projectData.start_date,
        projectData.end_date,
        projectData.budget,
        projectData.created_by
      ]
    );
    return result.insertId;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, c.name as client_name, c.company as client_company
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE 1=1
    `;
    const values = [];

    if (filters.client_id) {
      query += ' AND p.client_id = ?';
      values.push(filters.client_id);
    }

    if (filters.status) {
      query += ' AND p.status = ?';
      values.push(filters.status);
    }

    if (filters.created_by) {
      query += ' AND p.created_by = ?';
      values.push(filters.created_by);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT p.*, c.name as client_name, c.company as client_company
       FROM projects p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, projectData) {
    const [result] = await db.query(
      `UPDATE projects 
       SET name = ?, description = ?, client_id = ?, status = ?,
           start_date = ?, end_date = ?, budget = ?
       WHERE id = ?`,
      [
        projectData.name,
        projectData.description,
        projectData.client_id,
        projectData.status,
        projectData.start_date,
        projectData.end_date,
        projectData.budget,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status) {
    const [result] = await db.query(
      'UPDATE projects SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getProjectInvoices(projectId) {
    const [rows] = await db.query(
      'SELECT * FROM invoices WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
    return rows;
  }
}

module.exports = Project; 