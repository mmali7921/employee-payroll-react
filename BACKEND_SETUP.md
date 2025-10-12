# Employee Payroll Backend Setup

This guide will help you set up the MySQL + Node.js + Express backend for the Employee Payroll Management System.

## 🚀 Quick Setup

Run the automated setup script:

```bash
./setup-backend.sh
```

## 📋 Manual Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MySQL** (v8.0 or higher)
3. **npm** or **yarn**

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE employee_payroll;
```

2. **Update Database Configuration:**
Edit `server/config.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_payroll
```

### Step 3: Run Database Migration

```bash
npm run migrate
```

This will create all necessary tables and insert sample data.

### Step 4: Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 🗄️ Database Schema

The migration creates the following tables:

- **employees** - Employee information
- **departments** - Department data
- **payroll** - Payroll calculations
- **users** - User authentication
- **audit_logs** - System activity logs

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register new user

### Employees
- `GET /api/employees` - Get all employees (with pagination, search, filters)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Payroll
- `GET /api/payroll` - Get payroll data
- `POST /api/payroll/generate` - Generate payroll for period
- `PUT /api/payroll/process` - Process payroll
- `GET /api/payroll/summary` - Get payroll summary

## 🔑 Default Credentials

**Admin User:**
- Email: `admin@company.com`
- Password: `admin123`

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Configured for frontend
- **Input Validation** - Joi schema validation
- **Audit Logging** - Track all user actions

## 📊 Sample Data

The migration includes:
- 3 sample employees
- 5 departments
- 1 admin user
- Complete payroll calculations

## 🔧 Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_payroll

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Connection

The backend uses connection pooling for optimal performance:
- **Connection Limit:** 10
- **Timeout:** 60 seconds
- **Auto-reconnect:** Enabled

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in `config.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `config.env`
   - Kill existing process on port 3001

3. **Migration Failed**
   - Check database permissions
   - Ensure MySQL user has CREATE privileges

### Logs

- **Server logs:** Console output
- **Database logs:** MySQL error log
- **Audit logs:** Stored in `audit_logs` table

## 🔄 Development Workflow

1. **Start MySQL** service
2. **Run backend:** `cd server && npm run dev`
3. **Run frontend:** `npm run dev`
4. **Access:** http://localhost:5173

## 📈 Performance

- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Indexed database queries
- **Rate Limiting** - Prevent API overload
- **Caching** - JWT token validation

## 🔐 Security Best Practices

- **Environment Variables** - Sensitive data in .env
- **Input Validation** - All inputs validated
- **SQL Injection Protection** - Parameterized queries
- **Authentication** - JWT with expiration
- **Audit Trail** - Complete action logging

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check environment variables

The backend is now ready to serve the frontend application with full database integration!
