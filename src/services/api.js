// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/login';
        return { success: false, message: 'Authentication required' };
      }

      return {
        success: false,
        message: data.message || 'Request failed',
        error: data.error
      };
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    
    // More specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Unable to connect to server. Please check if the backend is running.',
        error: 'Connection failed'
      };
    }
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timed out. Please try again.',
        error: 'Timeout'
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error.message
    };
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (result.success && result.data.token) {
      setAuthToken(result.data.token);
    }

    return result;
  },

  logout: async () => {
    const result = await apiRequest('/auth/logout', {
      method: 'POST'
    });
    
    removeAuthToken();
    return result;
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

// Employees API
export const employeesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiRequest(`/employees${queryParams ? `?${queryParams}` : ''}`);
  },

  getById: async (id) => {
    return await apiRequest(`/employees/${id}`);
  },

  create: async (employeeData) => {
    const result = await apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
    return result;
  },

  update: async (id, employeeData) => {
    return await apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/employees/${id}`, {
      method: 'DELETE'
    });
  }
};

// Payroll API
export const payrollAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await apiRequest(`/payroll${queryParams ? `?${queryParams}` : ''}`);
  },

  generate: async (period, employeeIds = null) => {
    return await apiRequest('/payroll/generate', {
      method: 'POST',
      body: JSON.stringify({ period, employee_ids: employeeIds })
    });
  },

  process: async (period) => {
    return await apiRequest('/payroll/process', {
      method: 'PUT',
      body: JSON.stringify({ period })
    });
  },

  getSummary: async (period = null) => {
    const queryParams = period ? `?period=${period}` : '';
    return await apiRequest(`/payroll/summary${queryParams}`);
  }
};

// Departments API
export const departmentsAPI = {
  getAll: async () => {
    return await apiRequest('/departments');
  },

  create: async (departmentData) => {
    return await apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
  },

  update: async (id, departmentData) => {
    return await apiRequest(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/departments/${id}`, {
      method: 'DELETE'
    });
  }
};

// Reports API (placeholder)
export const reportsAPI = {
  getOverview: async (period = '2024') => {
    // This would typically fetch from backend
    return {
      success: true,
      data: {
        totalEmployees: 150,
        totalDepartments: 8,
        totalPayroll: 1250000,
        averageSalary: 83333,
        newHires: 12,
        departures: 3
      }
    };
  },

  getPayrollReport: async (period = '2024-01') => {
    return await payrollAPI.getSummary(period);
  },

  getDepartmentReport: async () => {
    return await departmentsAPI.getAll();
  }
};

export default {
  authAPI,
  employeesAPI,
  payrollAPI,
  departmentsAPI,
  reportsAPI
};
