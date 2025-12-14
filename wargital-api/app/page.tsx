"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState("");
  const [authData, setAuthData] = useState({ email: "user@example.com", password: "password123" });

  const addLog = (msg: string) => setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const testEndpoint = async (url: string, method = "GET", body?: any, useToken = false) => {
    addLog(`Testing ${method} ${url}...`);
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (useToken && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      addLog(`Status: ${res.status}`);
      addLog(`Response: ${JSON.stringify(data, null, 2)}`);

      if (url.includes("login") || url.includes("register")) {
        if (data.token) {
          setToken(data.token);
          addLog("Token saved for future requests.");
        }
      }
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wargital API Tester</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold mb-2">1. Health Check</h2>
            <button
              onClick={() => testEndpoint("/api/health")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test /api/health
            </button>
          </section>

          <section className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold mb-2">2. Auth (Register/Login)</h2>
            <div className="flex flex-col gap-2 mb-2">
              <input
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                className="border p-1 rounded"
                placeholder="Email"
              />
              <input
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                className="border p-1 rounded"
                placeholder="Password"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => testEndpoint("/api/auth/register", "POST", authData)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Register
              </button>
              <button
                onClick={() => testEndpoint("/api/auth/login", "POST", authData)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Login
              </button>
            </div>
            {token && <p className="text-xs text-green-600 mt-2">Token active!</p>}
          </section>

          <section className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold mb-2">3. Restaurants</h2>
            <button
              onClick={() => testEndpoint("/api/restaurants")}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Get Restaurants
            </button>
          </section>

          <section className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold mb-2">4. Orders</h2>
            <div className="flex gap-2">
              <button
                onClick={() => testEndpoint("/api/order", "GET", undefined, true)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                disabled={!token}
              >
                Get My Orders (Need Token)
              </button>
            </div>
          </section>
        </div>

        <div className="bg-gray-100 p-4 rounded h-[600px] overflow-auto font-mono text-sm border-2 border-gray-300">
          <h3 className="font-bold border-b pb-2 mb-2">Logs & Response</h3>
          {logs.length === 0 && <p className="text-gray-400">No logs yet...</p>}
          {logs.map((log, i) => (
            <div key={i} className="mb-1 whitespace-pre-wrap break-words border-b border-gray-200 pb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
