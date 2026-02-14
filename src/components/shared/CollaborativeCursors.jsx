import { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "../../utils/socket";

const ColaborativeCursors = ({ remoteUsers }) => {
  const [messagesByUser, setMessagesByUser] = useState({});
  const timersRef = useRef({});

  // local "my cursor" position (so we can anchor input next to it)
  const [myCursor, setMyCursor] = useState({ x: 0, y: 0 });

  // message composer state
  const [isComposing, setIsComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  // ✅ listen to remote messages
  useEffect(() => {
    const onReceiveMessage = ({ id, message }) => {
      if (!id || !message) return;

      setMessagesByUser((prev) => ({ ...prev, [id]: message }));

      if (timersRef.current[id]) clearTimeout(timersRef.current[id]);

      timersRef.current[id] = setTimeout(() => {
        setMessagesByUser((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        delete timersRef.current[id];
      }, 5_000);
    };

    socket.on("receive-message", onReceiveMessage);

    return () => {
      socket.off("receive-message", onReceiveMessage);
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  // ✅ track my cursor position in the viewport (for placing the input)
  useEffect(() => {
    const onMouseMove = (e) => {
      setMyCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const openComposer = useCallback(() => {
    setIsComposing(true);
    setDraft("");
  }, []);

  const closeComposer = useCallback(() => {
    setIsComposing(false);
    setDraft("");
  }, []);

  // ✅ Ctrl+K to open, Esc to close
  useEffect(() => {
    const onKeyDown = (e) => {
      const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCtrlK) {
        e.preventDefault();
        setIsComposing((prev) => {
          // toggle
          const next = !prev;
          return next;
        });
        // reset draft whenever opening
        setDraft("");
        return;
      }

      if (e.key === "Escape") {
        closeComposer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeComposer]);

  // ✅ focus input when opened
  useEffect(() => {
    if (isComposing) {
      // small delay ensures it exists in DOM
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isComposing]);

  const sendMessage = useCallback(() => {
    const msg = draft.trim();
    if (!msg) return;

    socket.emit("send-message", { message: msg });
    closeComposer();
  }, [draft, closeComposer]);

  return (
    <>
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

          {messagesByUser[user.id] && (
            <div className="absolute left-5 top-5 text-xs px-2 py-1 rounded-lg text-white bg-black/80 shadow-md whitespace-nowrap">
              {messagesByUser[user.id]}
            </div>
          )}
        </div>
      ))}

      {/* My message input (Ctrl+K) */}
      {isComposing && (
        <div
          className="fixed z-[9999]"
          style={{
            left: myCursor.x + 14,
            top: myCursor.y + 14,
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                closeComposer();
              }
            }}
            className="w-56 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-lg outline-none focus:border-black/20"
            placeholder="Type message…"
          />
          <div className="mt-1 text-[10px] text-black/50 select-none">
            Enter to send · Esc to cancel
          </div>
        </div>
      )}
    </>
  );
};

export default ColaborativeCursors;
