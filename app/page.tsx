"use client";

import { useState } from "react";
import HomeClient from "./HomeClient";
import Login from "./Login";

export default function Page() {
  const [user, setUser] = useState("");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <HomeClient user={user} />;
}