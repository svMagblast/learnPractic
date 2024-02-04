import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const RequestForm = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [request, setRequest] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!request) {
      setError('Пожалуйста, заполните поле запроса.');
      return;
    }

    try {
      await addDoc(collection(db, 'requests'), {
        text: request,
        status: 'В ожидании',
        createdAt: new Date(),
        userId: currentUser ? currentUser.uid : null,
      });
      setRequest('');
      setMessage('Запрос успешно отправлен.');
    } catch (error) {
      setError('Произошла ошибка при отправке запроса: ' + error.message);
    }
  };

  return (
    <div>
      {currentUser ? (
        <>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Опишите вашу проблему"
            />
            <button type="submit">Отправить запрос</button>
          </form>
        </>
      ) : (
        <p>Пожалуйста, войдите в систему, чтобы отправить запрос.</p>
      )}
    </div>
  );
};

export default RequestForm;
