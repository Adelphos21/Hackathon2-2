import React, { useState, useEffect } from 'react';
import { ExpenseDetail } from '../types';
import { expenseService } from '../services/api';
import '../styles/ExpenseDetail.css';

interface ExpenseDetailProps {
  categoryId: number;
  categoryName: string;
  year: number;
  month: number;
  onBack: () => void;
}

const ExpenseDetailComponent: React.FC<ExpenseDetailProps> = ({
  categoryId,
  categoryName,
  year,
  month,
  onBack
}) => {
  const [expenses, setExpenses] = useState<ExpenseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExpenseDetails();
  }, [categoryId, year, month]);

  const loadExpenseDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expenseService.getDetails(year, month, categoryId);
      setExpenses(data);
    } catch (err) {
      setError('Error al cargar los detalles de gastos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await expenseService.delete(id);
        setExpenses(expenses.filter(exp => exp.id !== id));
      } catch (err) {
        setError('Error al eliminar el gasto');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  const totalAmount = expenses.reduce((total, exp) => total + exp.amount, 0);

  if (loading) return <div className="loading">Cargando detalles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expense-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h2>Detalles: {categoryName}</h2>
        <p>Total: {formatCurrency(totalAmount)} | {expenses.length} gastos</p>
      </div>

      <div className="expenses-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <h4>{expense.description}</h4>
              <p className="expense-date">{formatDate(expense.date)}</p>
            </div>
            <div className="expense-actions">
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              <button 
                onClick={() => handleDelete(expense.id)}
                className="delete-btn"
                title="Eliminar gasto"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {expenses.length === 0 && (
        <div className="no-data">
          No hay gastos registrados en esta categoría para el período seleccionado
        </div>
      )}
    </div>
  );
};

export default ExpenseDetailComponent;