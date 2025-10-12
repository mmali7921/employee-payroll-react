#!/bin/bash

echo "🚀 Setting up Employee Payroll Backend with MySQL + Node.js + Express"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Node.js and MySQL are installed"

# Navigate to server directory
cd server

echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create database
echo "🗄️  Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS employee_payroll;"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create database. Please check your MySQL credentials."
    echo "💡 You may need to update the database credentials in server/config.env"
    exit 1
fi

echo "✅ Database created successfully"

# Run database migration
echo "🔄 Running database migration..."
npm run migrate

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    exit 1
fi

echo "✅ Database migration completed"

echo ""
echo "🎉 Backend setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update database credentials in server/config.env if needed"
echo "2. Start the backend server: cd server && npm run dev"
echo "3. Start the frontend: npm run dev"
echo ""
echo "🔗 Backend will run on: http://localhost:3001"
echo "🔗 Frontend will run on: http://localhost:5173"
echo ""
echo "📊 API Endpoints:"
echo "- Health Check: http://localhost:3001/health"
echo "- Login: POST http://localhost:3001/api/auth/login"
echo "- Employees: GET http://localhost:3001/api/employees"
echo "- Payroll: GET http://localhost:3001/api/payroll"
echo ""
echo "🔑 Default admin credentials:"
echo "- Email: admin@company.com"
echo "- Password: admin123"
