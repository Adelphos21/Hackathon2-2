import React, { useState } from 'react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Intentando login con:', email);
        const response = await authService.login({ email, passwd: password });
        console.log('Login exitoso:', response);
        const token = response.result.token;
        const username = response.result.username;
        login(token, username);
      } else {
        if (password.length < 12) {
          setError('La contraseña debe tener al menos 12 caracteres');
          setLoading(false);
          return;
        }
        console.log('Intentando registro con:', email);
        await authService.register({ email, passwd: password });
        setError('');
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        onToggle();
      }
    } catch (err) {
      console.error('Error en autenticación:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Accede a tu cuenta de Ahorrista' 
            : 'Crea tu cuenta para empezar a ahorrar'
          }
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? 1 : 12}
              placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 12 caracteres'}
            />
            {!isLogin && (
              <small>La contraseña debe tener al menos 12 caracteres</small>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button type="button" onClick={onToggle} className="toggle-btn">
            {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </p>
        
        {isLogin && (
          <div className="demo-info">
            <h4>💡 Para probar la app:</h4>
            <p>1. Regístrate con cualquier email y una contraseña de 12+ caracteres</p>
            <p>2. El sistema creará automáticamente 10,000 gastos de ejemplo</p>
            <p>3. Explora el resumen y haz clic en categorías para ver detalles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;