"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CollegeDetail() {
  const params = useParams();
  const [college, setCollege] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/college/${params.id}`)
      .then((res) => res.json())
      .then((data) => setCollege(data));
  }, [params.id]);

  if (!college) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>{college.name}</h1>

      <p><b>Location:</b> {college.location}</p>
      <p><b>Fees:</b> ₹ {college.fees}</p>
      <p><b>Rating:</b> ⭐ {college.rating}</p>

      {/* NEW DATA */}
      <p><b>Ranking:</b> #{college.ranking}</p>
      <p><b>Hostel:</b> {college.hostel}</p>
      <p><b>Website:</b> {college.website}</p>
      <p><b>Description:</b> {college.description}</p>

      <h3>Courses</h3>
      <ul>
        {college.courses.map((c: string, i: number) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      <h3>Facilities</h3>
      <ul>
        {college.facilities.map((f: string, i: number) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <h3>Placements</h3>
      <p>Average Package: {college.placements.avgPackage}</p>
      <p>Placement Rate: {college.placements.rate}</p>
    </div>
  );
}