# CRM System

A comprehensive Customer Relationship Management (CRM) system built with Node.js, Express, and MySQL.

## Features

- User authentication and authorization
- Client management
- Project tracking
- Invoice generation and management
- Contract generation and email delivery
- Input validation
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crm-system.git
cd crm-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=crm_db

# Server Configuration
PORT=3001
JWT_SECRET=your_jwt_secret_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

4. Initialize the database:
   - Open MySQL command line or a MySQL client
   - Run the SQL script in `src/database/init.sql`

## Running the Application

Start the server:
```bash
node src/server.js
```

The server will start on port 3001 (or the port specified in your .env file).

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Clients

- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/:id/projects` - Get client's projects
- `GET /api/clients/:id/invoices` - Get client's invoices

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `PATCH /api/projects/:id/status` - Update project status
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/invoices` - Get project's invoices

### Invoices

- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/stats` - Get invoice statistics

### Contracts

- `POST /api/contracts/project/:projectId` - Send project contract

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 