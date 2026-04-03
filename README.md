# PayrollPro - Modern Employee Payroll Management System

[![Dashboard](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/dashboard_1775194103871.png)](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/dashboard_1775194103871.png)

## 📋 Problem Statement
In many organizations, legacy payroll and employee management systems are often manual, error-prone, and lack real-time visibility. This results in administrative overhead, fragmented data, and a poor user experience. **PayrollPro** solves this by providing a unified, high-performance platform that automates personnel registry, payroll processing, and workforce analytics with a state-of-the-art glassmorphic design.

## 🛠 Tools Used
- **Frontend**: React 19, Tailwind CSS, Lucide React, Vite.
- **Backend**: Node.js (Express), JWT Authentication.
- **Database**: MySQL (mysql2).
- **Styling**: Glassmorphism (Backdrop-blur, Slate-950, Indigo/Purple Gradients).
- **Deployment**: Docker Compose.

## ⚙️ Installation Steps
1. **Clone the Project**:
   ```bash
   git clone <repository-url>
   cd employee-payroll-react
   ```
2. **Setup Server Configuration**:
   - Navigate to the `server` directory.
   - Configure your MySQL credentials in `config.env`.
3. **Install Dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```

## 🚀 Execution Procedure
### Option 1: Development Mode (Direct)
1. **Start Backend**:
   ```bash
   cd server
   npm run migrate && npm run dev
   ```
2. **Start Frontend**:
   ```bash
   # In a new terminal (root directory)
   npm run dev
   ```
3. **Access App**: Open `http://localhost:5173`. Use credentials: `admin@company.com` / `admin123`.

### Option 2: Docker Mode
```bash
docker-compose up --build
```

## 📸 Output Screenshots (Premium UI)

````carousel
![Dashboard](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/dashboard_1775194103871.png)
<!-- slide -->
![Employees Registry](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/employees_1775194130999.png)
<!-- slide -->
![Employee Profile](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/profile_1775194167716.png)
<!-- slide -->
![Departments](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/departments_1775194083456.png)
<!-- slide -->
![Payroll Processing](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/payroll_1775194210449.png)
<!-- slide -->
![Workforce Reports](file:///Users/muhammedali/.gemini/antigravity/brain/1e28aef7-ff5a-4510-a5f5-4181e4ab1b96/reports_1775194286293.png)
````

## 🎯 Conclusion
PayrollPro successfully transforms a standard college project into a high-end, production-grade payroll management system. By integrating modern web technologies (React 19, Tailwind) with a robust Node.js/MySQL backend, it offers a scalable solution for organizations to manage their most important asset—their people.