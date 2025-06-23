import React from "react";
import { FaSave } from "react-icons/fa";
import { MdSync, MdSyncDisabled } from "react-icons/md";
import MonacoEditor from "@monaco-editor/react";

type Props = {
    code: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSave: () => void;
    typing: boolean;
    roomId: string;
};

const Editor: React.FC<Props> = ({ code, onChange, onSave, typing, roomId }) => {
    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            const event = {
                target: { value },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(event);
        }
    };

    return (
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl ring-1 ring-gray-800">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-950 border-b border-gray-700">
                {/* Room Info */}
                <div className="flex items-center gap-3 text-sm font-medium text-gray-200">
                    <span className="text-green-500 text-lg animate-pulse">🧪</span>
                    <span className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-1.5 rounded-full shadow-inner shadow-green-800 font-mono tracking-wide">
                        Room ID: <span className="text-green-400 font-bold">{roomId}</span>
                    </span>
                </div>

                {/* Typing + Save */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        {typing ? (
                            <>
                                <MdSync className="animate-spin text-yellow-400" />
                                <span className="text-yellow-400">Someone is typing...</span>
                            </>
                        ) : (
                            <>
                                <MdSyncDisabled className="text-green-500" />
                                <span className="text-green-500">Code is synced</span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all px-4 py-2 rounded-md text-white text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
                    >
                        <FaSave /> Save
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div style={{ height: "calc(100vh - 65px)" }} className="bg-[#1e1e1e]">
                <MonacoEditor
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    language="javascript"
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        fontLigatures: true,
                        lineNumbers: "on",
                        fontFamily: `'Fira Code', 'JetBrains Mono', 'Courier New', monospace`,
                        cursorSmoothCaretAnimation: "on",
                        smoothScrolling: true,
                    }}
                />
            </div>
        </div>
    );
};

export default Editor;
