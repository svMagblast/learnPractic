import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'requests'), where('userId', '==', user.uid));

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const requestsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setRequests(requestsArray);
        });
      } else {
        setRequests([]); // Очистить запросы, если пользователь вышел
      }
    });

    return () => {
      unsubscribe && unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  return (
    <div>
      <h2>Ваши запросы</h2>
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request.id}>
            <p>Проблема: {request.text}</p>
            <p>Статус: {request.status}</p>
            {/* Другие поля запроса */}
          </div>
        ))
      ) : (
        <p>Запросы не найдены.</p>
      )}
    </div>
  );
};

export default RequestList;
