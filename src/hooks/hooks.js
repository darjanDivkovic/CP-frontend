import { useCallback, useState, useEffect } from "react";

import { obtainRoomToken, joinRoom } from "../components/pages/LandingPage/actions";
import { socket } from "../utils/socket";
import { throttle } from "lodash";

function useRoomAuthorization(roomId) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const authorize = useCallback(async () => {
    setError("");

    try {
      // Step 1: get auth token
      await obtainRoomToken(roomId, password);

      // Step 2: join room with token (backend should validate)
      const res = await joinRoom(roomId);

      setRoomName(res.data?.roomName || roomId);
      setIsAuthorized(true);
    } catch (err) {
      console.warn("Room authorization failed", err);
      setError("Wrong password or server error. Please try again.");
      setIsAuthorized(false);
    }
  }, [roomId, password]);

  // Optional: try public join first (no password)
  const tryPublicJoin = useCallback(async () => {
    try {
      const res = await joinRoom(roomId);
      setRoomName(res.data?.roomName || roomId);
      setIsAuthorized(true);
      return true;
    } catch (err) {
      // most likely needs password → show password form
      return false;
    }
  }, [roomId]);

  return {
    isAuthorized,
    password,
    setPassword,
    roomName,
    error,
    authorize,
    tryPublicJoin,
  };
}

function useCollaborativeCursors(isAuthorized, roomId, containerRef) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAuthorized) return;

    const username = localStorage.getItem("username") || "Anonymous";

    socket.connect();
    socket.emit("join-room", { roomId, username });

    socket.on("users-update", setUsers);

    socket.on("cursor-update", ({ id, x, y }) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, x, y } : u)));
    });

    const sendCursor = throttle(
      (x, y) => socket.emit("cursor-move", { x, y }),
      50,
      { leading: true, trailing: true }
    );

    const handleMouseMove = (e) => {
      const el = containerRef?.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // coords relative to canvas
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      sendCursor(x, y);
    };

    // IMPORTANT: listen on the canvas, not window
    const el = containerRef?.current;
    el?.addEventListener("mousemove", handleMouseMove);

    return () => {
      el?.removeEventListener("mousemove", handleMouseMove);
      sendCursor.cancel();
      socket.off("users-update");
      socket.off("cursor-update");
      socket.disconnect();
    };
  }, [isAuthorized, roomId, containerRef]);

  return users;
}


export { useRoomAuthorization, useCollaborativeCursors };