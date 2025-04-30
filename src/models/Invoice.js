const db = require('../config/database');

class Invoice {
  static async create(invoiceData) {
    const [result] = await db.query(
      `INSERT INTO invoices 
       (project_id, client_id, amount, status, due_date, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceData.project_id,
        invoiceData.client_id,
        invoiceData.amount,
        invoiceData.status || 'draft',
        invoiceData.due_date,
        invoiceData.notes,
        invoiceData.created_by
      ]
    );
    return result.insertId;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT i.*, c.name as client_name, c.company as client_company,
             p.name as project_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (filters.client_id) {
      query += ' AND i.client_id = ?';
      values.push(filters.client_id);
    }

    if (filters.project_id) {
      query += ' AND i.project_id = ?';
      values.push(filters.project_id);
    }

    if (filters.status) {
      query += ' AND i.status = ?';
      values.push(filters.status);
    }

    if (filters.created_by) {
      query += ' AND i.created_by = ?';
      values.push(filters.created_by);
    }

    if (filters.start_date) {
      query += ' AND i.created_at >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND i.created_at <= ?';
      values.push(filters.end_date);
    }

    query += ' ORDER BY i.created_at DESC';

    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT i.*, c.name as client_name, c.company as client_company,
              p.name as project_name
       FROM invoices i
       LEFT JOIN clients c ON i.client_id = c.id
       LEFT JOIN projects p ON i.project_id = p.id
       WHERE i.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, invoiceData) {
    const [result] = await db.query(
      `UPDATE invoices 
       SET project_id = ?, client_id = ?, amount = ?, status = ?,
           due_date = ?, payment_date = ?, notes = ?
       WHERE id = ?`,
      [
        invoiceData.project_id,
        invoiceData.client_id,
        invoiceData.amount,
        invoiceData.status,
        invoiceData.due_date,
        invoiceData.payment_date,
        invoiceData.notes,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, status, payment_date = null) {
    const [result] = await db.query(
      'UPDATE invoices SET status = ?, payment_date = ? WHERE id = ?',
      [status, payment_date, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM invoices WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getStats(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_invoices,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'sent' THEN amount ELSE 0 END) as total_pending,
        SUM(amount) as total_amount
      FROM invoices
      WHERE 1=1
    `;
    const values = [];

    if (filters.client_id) {
      query += ' AND client_id = ?';
      values.push(filters.client_id);
    }

    if (filters.created_by) {
      query += ' AND created_by = ?';
      values.push(filters.created_by);
    }

    if (filters.start_date) {
      query += ' AND created_at >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND created_at <= ?';
      values.push(filters.end_date);
    }

    const [rows] = await db.query(query, values);
    return rows[0];
  }
}

module.exports = Invoice; 