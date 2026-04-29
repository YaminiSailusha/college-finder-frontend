"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);

  const router = useRouter();
  const perPage = 3;

  // ✅ Fetch data
  useEffect(() => {
    fetch("http://localhost:5000/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data));
  }, []);

  // ✅ Select colleges
  const handleSelect = (college: any) => {
    if (selected.some((c) => c.id === college.id)) {
      setSelected(selected.filter((c) => c.id !== college.id));
    } else {
      setSelected([...selected, college]);
    }
  };

  // ✅ Favorites
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // ✅ Search
  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "fees") return a.fees - b.fees;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // ✅ Pagination
  const paginated = sorted.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
      }}
    >
      <h2>🎓 College Finder</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search college..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "250px",
          borderRadius: "8px",
        }}
      />

      {/* 🔽 Sorting */}
      <div style={{ marginBottom: "10px" }}>
        Sort By:
        <select
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="rating">Rating</option>
          <option value="fees">Fees</option>
        </select>
      </div>

      {/* 📋 College List */}
      {paginated.map((c) => (
        <div
          key={c.id}
          style={{
            padding: "10px",
            margin: "5px 0",
            background: "#222",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {/* Click to open detail */}
          <div onClick={() => router.push(`/college/${c.id}`)}>
            <input
              type="checkbox"
              checked={selected.some((s) => s.id === c.id)}
              onChange={() => handleSelect(c)}
            />
            {"  "}
            {c.name} - {c.location}
          </div>

          {/* ❤️ Favorite */}
          <button onClick={() => toggleFavorite(c.id)}>
            {favorites.includes(c.id) ? "❤️" : "🤍"}
          </button>

          {/* 🏆 Ranking */}
          <span
            style={{
              marginLeft: "10px",
              background: "gold",
              padding: "3px 6px",
              borderRadius: "5px",
              color: "black",
            }}
          >
            #{c.ranking}
          </span>
        </div>
      ))}

      {/* 📄 Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page * perPage >= sorted.length}
        >
          Next
        </button>
      </div>

      {/* 📊 Compare */}
      <h3 style={{ marginTop: "20px" }}>Compare Colleges</h3>

      {selected.length === 0 ? (
        <p>No colleges selected</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{
            marginTop: "10px",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Fees</th>
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            {selected.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>₹ {c.fees}</td>
                <td>{c.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}