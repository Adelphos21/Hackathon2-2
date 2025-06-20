import React, { useState, useEffect } from 'react';
import { ExpenseSummary } from '../types';
import { expenseService } from '../services/api';
import '../styles/ExpenseSummary.css';

interface ExpenseSummaryProps {
  onCategoryClick: (categoryId: number, categoryName: string) => void;
}

const ExpenseSummaryComponent: React.FC<ExpenseSummaryProps> = ({ onCategoryClick }) => {
  const [summary, setSummary] = useState<ExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expenseService.getSummary(selectedYear, selectedMonth);
      setSummary(data);
    } catch (err) {
      setError('Error al cargar el resumen de gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const totalGastos = summary.reduce((total, item) => total + item.totalAmount, 0);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = [2023, 2024, 2025];

  if (loading) return <div className="loading">Cargando resumen...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expense-summary">
      <div className="summary-header">
        <h2>Resumen de Gastos</h2>
        <div className="filters">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="total-amount">
        <h3>Total del mes: {formatCurrency(totalGastos)}</h3>
      </div>

      <div className="categories-grid">
        {summary.map((item) => (
          <div 
            key={item.categoryId} 
            className="category-card"
            onClick={() => onCategoryClick(item.categoryId, item.categoryName)}
          >
            <h4>{item.categoryName}</h4>
            <p className="amount">{formatCurrency(item.totalAmount)}</p>
            <p className="percentage">
              {((item.totalAmount / totalGastos) * 100).toFixed(1)}% del total
            </p>
          </div>
        ))}
      </div>

      {summary.length === 0 && (
        <div className="no-data">
          No hay gastos registrados para este período
        </div>
      )}
    </div>
  );
};

export default ExpenseSummaryComponent;