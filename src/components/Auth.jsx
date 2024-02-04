import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const Auth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Отписка при размонтировании компонента
  }, []);

  const handleRegister = async () => {
    setError('');
    setMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Успешная регистрация!');
    } catch (error) {
      setError('Ошибка регистрации: ' + error.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Успешный вход!');
    } catch (error) {
      setError('Ошибка входа: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Вы успешно вышли из системы.');
    } catch (error) {
      setError('Ошибка при попытке выхода: ' + error.message);
    }
  };

  return (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {currentUser ? (
        <div>
          <p>Вы вошли как {currentUser.email}</p>
          <button onClick={handleLogout}>Выйти из аккаунта</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {isRegistering ? (
            <button onClick={handleRegister}>Register</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Уже зарегистрированы? Войти' : 'Нет аккаунта? Регистрация'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
