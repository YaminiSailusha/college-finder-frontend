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
  const [filtered, setFiltered] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ITEMS_PER_PAGE = 5;

  // ✅ FETCH WITH RETRY (important for Render)
  useEffect(() => {
    const fetchColleges = async (retry = 3) => {
      try {
        const res = await fetch(
          "https://college-backend-hhe7.onrender.com/colleges"
        );

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid data");

        setColleges(data);
        setFiltered(data);
        setLoading(false);
      } catch (err) {
        if (retry > 0) {
          setTimeout(() => fetchColleges(retry - 1), 2000);
        } else {
          setError("Failed to load colleges. Try again.");
          setLoading(false);
        }
      }
    };

    fetchColleges();
  }, []);

  // ✅ SEARCH + SORT
  useEffect(() => {
    let result = colleges.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "fees") result.sort((a, b) => a.fees - b.fees);

    setFiltered(result);
    setPage(1);
  }, [search, sortBy, colleges]);

  // ✅ PAGINATION
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // ✅ SELECT
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedColleges = colleges.filter((c) =>
    selected.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎓 College Finder
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search college..."
        className="w-full p-3 mb-4 rounded bg-gray-200 text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SORT */}
      <div className="mb-4 text-center">
        Sort By:{" "}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-black p-2 rounded"
        >
          <option value="rating">Rating</option>
          <option value="fees">Fees</option>
        </select>
      </div>

      {/* STATUS */}
      {loading && <p className="text-center">⏳ Loading colleges...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {/* COLLEGE LIST */}
      {!loading && !error && (
        <div className="grid gap-4">
          {paginated.map((college) => (
            <div
              key={college.id}
              className="bg-gray-700 p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {college.name}
                </h2>
                <p className="text-sm text-gray-300">
                  📍 {college.location}
                </p>
                <p>💰 ₹ {college.fees}</p>
                <p>⭐ {college.rating}</p>
              </div>

              <input
                type="checkbox"
                checked={selected.includes(college.id)}
                onChange={() => toggleSelect(college.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-600 rounded mr-2"
          >
            Prev
          </button>

          Page {page}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-600 rounded ml-2"
          >
            Next
          </button>
        </div>
      )}

      {/* COMPARE */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">
          📊 Compare Colleges
        </h2>

        {selectedColleges.length === 0 ? (
          <p>No colleges selected</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600">
              <thead>
                <tr className="bg-gray-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Fees</th>
                  <th className="p-2">Rating</th>
                </tr>
              </thead>

              <tbody>
                {selectedColleges.map((c) => (
                  <tr key={c.id} className="text-center">
                    <td className="p-2">{c.name}</td>
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