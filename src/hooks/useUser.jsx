import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../api/firebaseConfig";
import Loading from "../components/Loading";

const UserContext = createContext();

const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribeUser?.();

      if (user) {
        unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
          const userData = {
            id: user.uid,
            ...doc.data(),
          };

          setUser(userData);
          setTimeout(() => setLoading(false), 2300);
        });

        return;
      }

      setUser(null);
      setTimeout(() => setLoading(false), 2300);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={user}>
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  );
};

export { useUser, UserProvider };
