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

  const ITEMS_PER_PAGE = 5;

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch(
          "https://college-backend-hhe7.onrender.com/colleges"
        );
        const data = await res.json();

        console.log("DATA:", data);

        setColleges(data);
        setFiltered(data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    };

    fetchColleges();
  }, []);

  // ✅ SEARCH
  useEffect(() => {
    let result = colleges.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ SORT
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "fees") {
      result.sort((a, b) => a.fees - b.fees);
    }

    setFiltered(result);
    setPage(1);
  }, [search, sortBy, colleges]);

  // ✅ PAGINATION
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // ✅ SELECT COLLEGES
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectedColleges = colleges.filter((c) =>
    selected.includes(c.id)
  );

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎓 College Finder</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search college..."
        className="p-2 mb-4 w-full text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SORT */}
      <div className="mb-4">
        Sort By:{" "}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-black p-1"
        >
          <option value="rating">Rating</option>
          <option value="fees">Fees</option>
        </select>
      </div>

      {/* LIST */}
      {paginated.length === 0 ? (
        <p>Loading colleges...</p>
      ) : (
        <div>
          {paginated.map((college) => (
            <div
              key={college.id}
              className="p-3 mb-2 border border-gray-600 rounded flex justify-between"
            >
              <div>
                <h2 className="font-semibold">{college.name}</h2>
                <p>{college.location}</p>
                <p>₹ {college.fees}</p>
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
      <div className="mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="mr-2"
        >
          Prev
        </button>

        Page {page}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="ml-2"
        >
          Next
        </button>
      </div>

      {/* COMPARE */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Compare Colleges</h2>

        {selectedColleges.length === 0 ? (
          <p>No colleges selected</p>
        ) : (
          <table className="mt-2 border border-gray-600">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Location</th>
                <th className="p-2">Fees</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>

            <tbody>
              {selectedColleges.map((c) => (
                <tr key={c.id}>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.location}</td>
                  <td className="p-2">₹ {c.fees}</td>
                  <td className="p-2">⭐ {c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}