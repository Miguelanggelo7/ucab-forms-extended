import { useState, useEffect } from "react";

const getConnection = () => {
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection
  );
};

export const useNetwork = () => {
  const [connection, updateConnection] = useState(getConnection());
  const [isOnline, setIsOnline] = useState(!!getConnection().rtt);

  useEffect(() => {
    const updateStatus = () => {
      updateConnection(getConnection());
      setIsOnline(!!getConnection().rtt);
    };

    connection.addEventListener("change", updateStatus);
    return () => connection.removeEventListener("change", updateStatus);
  }, [connection]);

  return [isOnline, connection];
};
