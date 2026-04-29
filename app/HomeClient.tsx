"use client";

import { useEffect, useState } from "react";

type College = {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
};

export default function HomeClient() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://college-backend-hhe7.onrender.com/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedColleges = colleges.filter((c) =>
    selected.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-6">
      
      <h1 className="text-4xl font-bold text-center mb-6">
        🎓 College Finder
      </h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search colleges..."
        className="w-full p-3 mb-6 rounded-lg text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 COLLEGE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((c, index) => (
          <div
            key={c.id}
            className="bg-gray-800 p-5 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            {/* 🏆 TOP BADGE */}
            {index < 3 && (
              <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                🏆 Top {index + 1}
              </span>
            )}

            <h2 className="text-xl font-semibold mt-2">{c.name}</h2>
            <p className="text-gray-300">📍 {c.location}</p>

            <div className="mt-2">
              <p>💰 ₹ {c.fees}</p>
              <p>⭐ {c.rating}</p>
            </div>

            <button
              onClick={() => toggleSelect(c.id)}
              className="mt-3 px-3 py-1 bg-blue-600 rounded"
            >
              {selected.includes(c.id) ? "Remove" : "Compare"}
            </button>
          </div>
        ))}
      </div>

      {/* 📊 COMPARE TABLE */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-3">📊 Compare Colleges</h2>

        {selectedColleges.length === 0 ? (
          <p>No colleges selected</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3">Name</th>
                  <th>Location</th>
                  <th>Fees</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                {selectedColleges.map((c) => (
                  <tr key={c.id} className="text-center border-t">
                    <td className="p-3">{c.name}</td>
                    <td>{c.location}</td>
                    <td>₹ {c.fees}</td>
                    <td>⭐ {c.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}