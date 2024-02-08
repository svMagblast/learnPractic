import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/Auth.module.css';

const Auth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!fullName) {
      formIsValid = false;
      errors['fullName'] = 'Пожалуйста, введите ваше ФИО.';
    }

    if (!username) {
      formIsValid = false;
      errors['username'] = 'Пожалуйста, введите логин.';
    }

    if (!email) {
      formIsValid = false;
      errors['email'] = 'Пожалуйста, введите email.';
    }

    if (!password) {
      formIsValid = false;
      errors['password'] = 'Пожалуйста, введите пароль.';
    }

    if (password !== confirmPassword) {
      formIsValid = false;
      errors['confirmPassword'] = 'Пароли не совпадают.';
    }

    if (!agree) {
      formIsValid = false;
      errors['agree'] = 'Необходимо ваше согласие.';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        fullName,
        username,
        email,
        role: 'user',
      });

      setMessage('Успешная регистрация!');
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgree(false);
    } catch (error) {
      setError('Ошибка регистрации: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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
          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ФИО"
              />
              {errors.fullName && <div className="error">{errors.fullName}</div>}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Логин"
              />
              {errors.username && <div className="error">{errors.username}</div>}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              {errors.email && <div className="error">{errors.email}</div>}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
              />
              {errors.password && <div className="error">{errors.password}</div>}
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
              />
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
              <label>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                Согласен на обработку ПД
              </label>
              {errors.agree && <div className="error">{errors.agree}</div>}
              <button type="submit">Регистрация</button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
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
                placeholder="Пароль"
              />
              <button type="submit">Войти</button>
            </form>
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
