# Employee Payroll System - React Version

This is a React-based employee payroll system converted from TypeScript Next.js to JavaScript React with Vite.

## Features

- ✅ **Pure React with JavaScript** - No TypeScript
- ✅ **Modern React with Hooks** - Uses React 18 with functional components
- ✅ **Client-Side Routing** - React Router for navigation
- ✅ **Tailwind CSS** - Modern utility-first CSS framework
- ✅ **Component Library** - Reusable UI components
- ✅ **Employee Management** - Add and view employees
- ✅ **Responsive Design** - Works on all devices

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   └── ... (50+ components)
│   ├── employee-form.jsx   # Employee form component
│   └── theme-provider.jsx  # Theme provider
├── hooks/                  # Custom React hooks
│   ├── use-mobile.js
│   └── use-toast.js
├── lib/                    # Utility libraries
│   ├── utils.js           # Utility functions
│   └── mysql.js           # MySQL database utilities
├── styles/
│   └── globals.css        # Global styles with Tailwind
├── App.jsx                # Main application component
└── main.jsx               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd employee-payroll-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **MySQL2** - MySQL database driver

## Key Differences from Next.js Version

1. **No Server-Side Rendering** - This is a client-side React app
2. **Client-Side Routing** - Uses React Router instead of Next.js routing
3. **No API Routes** - Database operations would need to be handled by a separate backend
4. **Pure JavaScript** - No TypeScript types or interfaces
5. **Vite Build System** - Faster development and building

## Database Integration

The MySQL utilities are included but would need a backend API to work properly. For a full-stack solution, you would need to:

1. Create a backend API (Node.js/Express, Python/Flask, etc.)
2. Set up MySQL database
3. Create API endpoints for employee operations
4. Update the React components to call the API instead of direct database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.