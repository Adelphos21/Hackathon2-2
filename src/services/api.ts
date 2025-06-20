import { 
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ExpenseSummary, 
  ExpenseDetail, 
  ExpenseCreate, 
  Category
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://198.211.105.95:8080';

// Función para obtener el token del localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Función para crear headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
};

// Servicio de Autenticación
export const authService = {
  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/authentication/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await handleResponse(response);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/authentication/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await handleResponse(response);
    
    // Ajuste para la estructura real del backend
    if (result && result.result && result.result.token) {
      return {
        status: result.status || 200,
        message: result.message || 'success',
        data: {
          token: result.result.token,
          email: result.result.username // Usamos username como email
        }
      };
    }
    
    throw new Error('No se recibió un token válido del backend');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
};

// Servicio de Gastos
export const expenseService = {
  async getSummary(year: number, month: number): Promise<ExpenseSummary[]> {
    const response = await fetch(
      `${API_BASE_URL}/expenses_summary?year=${year}&month=${month}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  async getDetails(
    year: number, 
    month: number, 
    categoryId: number
  ): Promise<ExpenseDetail[]> {
    const response = await fetch(
      `${API_BASE_URL}/expenses/detail?year=${year}&month=${month}&categoryId=${categoryId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return handleResponse(response);
  },

  async create(expense: ExpenseCreate): Promise<ExpenseDetail> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expense)
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  }
};

// Servicio de Categorías
export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/expenses_category`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};