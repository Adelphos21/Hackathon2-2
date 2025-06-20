// Tipos para autenticación
export interface LoginRequest {
  email: string;
  passwd: string;
}

export interface LoginResponse {
  result: any;
  status: number;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

export interface RegisterRequest {
  email: string;
  passwd: string;
}

// Tipos para gastos
export interface ExpenseSummary {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
}

export interface ExpenseDetail {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface ExpenseCreate {
  amount: number;
  description: string;
  categoryId: number;
  date: string;
}
// Tipo adicional para la solicitud al backend
export interface ExpenseCreateRequest {
  amount: number;
  description: string;
  category: {
    id: number;
  };
  date: string;
}

// Tipos para categorías
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Tipos para metas
export interface Goal {
  id: number;
  amount: number;
  month: number;
  year: number;
  description?: string;
}

export interface GoalCreate {
  amount: number;
  month: number;
  year: number;
  description?: string;
}

// Tipos de estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
}