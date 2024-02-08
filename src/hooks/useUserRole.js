import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const useUserRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, []);
  console.log(role);
  return role;
};

export default useUserRole;
