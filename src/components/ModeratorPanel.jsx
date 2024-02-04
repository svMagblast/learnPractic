import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const ModeratorPanel = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'requests'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const requestDoc = doc(db, 'requests', id);
    try {
      await updateDoc(requestDoc, { status: newStatus });
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  return (
    <div>
      <h2>Панель модератора</h2>
      {requests.map((request) => (
        <div key={request.id}>
          <p>Проблема: {request.text}</p>
          <p>Текущий статус: {request.status}</p>
          <select
            onChange={(e) => handleStatusChange(request.id, e.target.value)}
            value={request.status}>
            <option value="В ожидании">В ожидании</option>
            <option value="Рассматривается">Рассматривается</option>
            <option value="Вопрос решён">Вопрос решён</option>
            <option value="Отклонено">Отклонено</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default ModeratorPanel;
