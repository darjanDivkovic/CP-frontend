import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useCollaborativeCursors,
  useRoomAuthorization,
} from "../../../hooks/hooks";
import ColaborativeCursors from "../../shared/CollaborativeCursors";
import AuthorizeOnRoom from "./components/AuthorizeOnRoom";

import { socket } from "../../../utils/socket";

export default function RoomPage() {
  const { id: roomId } = useParams();
  const canvasRef = useRef(null);

  const {
    isAuthorized,
    password,
    setPassword,
    roomName,
    error,
    authorize,
    tryPublicJoin,
  } = useRoomAuthorization(roomId);

  // Attempt public join on mount (no password rooms)
  useEffect(() => {
    let ignore = false;

    tryPublicJoin().then((success) => {
      if (ignore) return;
      if (!success) {
        // room requires password → do nothing, show form
      }
    });

    return () => {
      ignore = true;
    };
  }, [tryPublicJoin]);

  const users = useCollaborativeCursors(isAuthorized, roomId, canvasRef);

  const remoteUsers = users.filter((u) => u.id !== socket.id);

  console.log("remote users", remoteUsers);

  return (
    <div className="relative min-h-screen border p-6 w-full overflow-hidden">
      <header className="flex items-center justify-between">
        <div className="flex items-end gap-6">
          <h1 className="text-3xl font-bold">CoPulse</h1>
          <h2 className="text-xl opacity-40 mb-1">{roomName || roomId}</h2>
        </div>
      </header>

      {!isAuthorized ? (
        <AuthorizeOnRoom
          error={error}
          password={password}
          setPassword={setPassword}
          authorize={authorize}
        />
      ) : (
        <>
          <main
            ref={canvasRef}
            className="mt-6 h-[calc(100vh-140px)] bg-gray-50/40 rounded-xl flex items-center justify-center relative overflow-hidden"
          >
            <p className="text-sm opacity-20 pointer-events-none">
              Collaborative canvas / editor / whiteboard area goes here...
            </p>

            <ColaborativeCursors remoteUsers={remoteUsers} />
          </main>
        </>
      )}
    </div>
  );
}
