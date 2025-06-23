import React from "react";

type Props = {
    roomId: string;
    setRoomId: (roomId: string) => void;
    onJoin: () => void;
};

const RoomJoin: React.FC<Props> = ({ roomId, setRoomId, onJoin }) => (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="flex gap-4">
            <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 w-64"
                placeholder="Enter Room ID"
            />
            <button
                onClick={onJoin}
                className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
            >
                Join Room
            </button>
        </div>
    </div>
);

export default RoomJoin;
