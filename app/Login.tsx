"use client";

import { useState } from "react";

export default function Login({ onLogin }: any) {
  const [username, setUsername] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-2xl mb-4">🔐 Login</h1>

      <input
        placeholder="Enter your name"
        className="p-2 mb-3 rounded bg-slate-700"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={() => onLogin(username)}
        className="px-4 py-2 bg-cyan-600 rounded"
      >
        Login
      </button>
    </div>
  );
}