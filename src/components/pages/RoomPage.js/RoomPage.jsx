import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; 
import { useRoomAuthorization, useCollaborativeCursors } from "../../../hooks/hooks";
import { socket } from "../../../utils/socket";
import TextInput from "../../shared/TextInput";
import PrimaryButton from "../../shared/PrimaryButton";

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

  const users = useCollaborativeCursors(isAuthorized, roomId, canvasRef);

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

  const remoteUsers = users.filter((u) => u.id !== socket.id);

  return (
    <div className="relative min-h-screen border p-6 w-full overflow-hidden">
      <header className="flex items-center justify-between">
        <div className="flex items-end gap-6">
          <h1 className="text-3xl font-bold">CoPulse</h1>
          <h2 className="text-xl opacity-40 mb-1">
            {roomName || roomId}
          </h2>
        </div>
      </header>

      {!isAuthorized ? (
        <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center gap-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold">
              Password Protected Room
            </h2>
            <p className="text-sm opacity-70 max-w-md">
              Enter the password you received to join this collaborative space.
            </p>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          </div>

          <div className="flex flex-col items-center gap-4 w-80">
            <TextInput
              placeholder="Room password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <PrimaryButton
              onClick={authorize}
              disabled={!password.trim()}
            >
              Join Room
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <main ref={canvasRef} className="mt-6 h-[calc(100vh-140px)] bg-gray-50/40 rounded-xl flex items-center justify-center relative overflow-hidden">
            <p className="text-sm opacity-20 pointer-events-none">
              Collaborative canvas / editor / whiteboard area goes here...
            </p>

            {/* Remote cursors */}
            {remoteUsers.map((user) => (
              <div
                key={user.id}
                className="pointer-events-none absolute z-50 transition-transform duration-100 ease-out"
                style={{
                  transform: `translate(${user.x}px, ${user.y}px)`,
                  left: -10,
                  top: -10,
                }}
              >
                <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                  <path
                    d="M10 0 L2 12 L10 12 L10 28"
                    fill={user.color ?? "#6366f1"}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
                <div
                  className="absolute left-5 top-[-4px] text-xs font-medium px-2 py-0.5 rounded-full text-white shadow-md whitespace-nowrap"
                  style={{ backgroundColor: user.color ?? "#6366f1" }}
                >
                  {user.name}
                </div>
              </div>
            ))}
          </main>
        </>
      )}
    </div>
  );
}