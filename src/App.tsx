import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseDetail from './components/ExpenseDetail';
import ExpenseForm from './components/ExpenseForm';
import './styles/App.css';

interface SelectedCategory {
  id: number;
  name: string;
}

const AppContent: React.FC = () => {
  const { state, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
  };

  const handleBackToSummary = () => {
    setSelectedCategory(null);
  };

  const handleExpenseCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!state.isAuthenticated) {
    return (
      <AuthForm 
        isLogin={isLogin} 
        onToggle={() => setIsLogin(!isLogin)} 
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Ahorrista</h1>
          <div className="header-actions">
            <span>Hola, {state.email}</span>
            <button 
              onClick={() => setShowExpenseForm(true)}
              className="new-expense-btn"
            >
              + Nuevo Gasto
            </button>
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {selectedCategory ? (
          <ExpenseDetail
            key={`${selectedCategory.id}-${refreshKey}`}
            categoryId={selectedCategory.id}
            categoryName={selectedCategory.name}
            year={currentYear}
            month={currentMonth}
            onBack={handleBackToSummary}
          />
        ) : (
          <ExpenseSummary
            key={refreshKey}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </main>

      {showExpenseForm && (
        <ExpenseForm
          onExpenseCreated={handleExpenseCreated}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;