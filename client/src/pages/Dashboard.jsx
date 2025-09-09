import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      (async () => {
        try {
          setLoading(true);
          const data = await api.me();
          setMe(data.user);
        } catch {
          logout();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  if (loading) return <div className="card"><p>Loading...</p></div>;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>You are logged in as <strong>{me?.email}</strong>.</p>
      <p>Preferred currency: <strong>{me?.currency || "—"}</strong></p>
      <p className="muted">Here you’ll add budgets, transactions, and charts.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
