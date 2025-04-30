const db = require('../config/database');

class Client {
  static async create(clientData) {
    const [result] = await db.query(
      'INSERT INTO clients (name, email, phone, company, address, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [clientData.name, clientData.email, clientData.phone, clientData.company, clientData.address, clientData.created_by]
    );
    return result.insertId;
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM clients WHERE 1=1';
    const values = [];

    if (filters.created_by) {
      query += ' AND created_by = ?';
      values.push(filters.created_by);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.query(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, clientData) {
    const [result] = await db.query(
      'UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, address = ? WHERE id = ?',
      [clientData.name, clientData.email, clientData.phone, clientData.company, clientData.address, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getClientProjects(clientId) {
    const [rows] = await db.query(
      'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC',
      [clientId]
    );
    return rows;
  }

  static async getClientInvoices(clientId) {
    const [rows] = await db.query(
      'SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC',
      [clientId]
    );
    return rows;
  }
}

module.exports = Client; 