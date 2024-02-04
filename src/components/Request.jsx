import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const RequestForm = () => {
  const [request, setRequest] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        status: 'В ожидании', // Начальный статус запроса
        createdAt: new Date(),
      });
      setRequest('');
      setMessage('Запрос успешно отправлен.');
    } catch (error) {
      setError('Произошла ошибка при отправке запроса: ' + error.message);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default RequestForm;
