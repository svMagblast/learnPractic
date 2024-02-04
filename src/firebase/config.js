import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAmKcohLqLofgRc4ahfhJD4nk7eSDIvU3w',
  authDomain: 'helper-school.firebaseapp.com',
  projectId: 'helper-school',
  storageBucket: 'helper-school.appspot.com',
  messagingSenderId: '471453824994',
  appId: '1:471453824994:web:26f1deed08b17a722e6bbb',
};

const app = initializeApp(firebaseConfig);

// Экспортируем инстансы auth и firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
