import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

const useSocket = () => {
  const socketRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5001",
      {
        auth: { token },
        transports: ["websocket"],
      }
    );

    

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  return socketRef;
};

export default useSocket;
