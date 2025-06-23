import React, { useEffect, useState } from "react";
import socket from "./sockets/socket";
import { fetchCode, saveCode } from "./services/api";
import RoomJoin from "./components/RoomJoin";
import Editor from "./components/Editor";

const App: React.FC = () => {
  const [roomId, setRoomId] = useState("room1");
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!joined) return;

    socket.emit("join", roomId);
    fetchCode(roomId).then(setCode);

    const handleCodeChange = (newCode: string) => {
      setTyping(true);
      setCode(newCode);
      setTimeout(() => setTyping(false), 300);
    };

    socket.on("codeChange", handleCodeChange);

    return () => {
      socket.off("codeChange", handleCodeChange);
    };
  }, [joined, roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
  };

  const handleSave = async () => {
    await saveCode(roomId, code);
    alert("Saved!");
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      <div className="mx-auto">
        {!joined ? (
          <RoomJoin roomId={roomId} setRoomId={setRoomId} onJoin={() => setJoined(true)} />
        ) : (
          <Editor
            code={code}
            onChange={handleChange}
            onSave={handleSave}
            typing={typing}
            roomId={roomId}
          />
        )}
      </div>
    </div>
  );
};

export default App;
