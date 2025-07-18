import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    videos:0,
    parishes: 0,
    media: 0,
    users: 0,
  });

  useEffect(() => {
    axios.get("/api/admin/stats").then((res) => {
      setStats(res.data);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-primary mb-4">Welcome to the Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="News Articles" count={stats.news} />
        <DashboardCard title="Events" count={stats.events} />
        <DashboardCard title="videos" count={stats.videos} />
        <DashboardCard title="Parishes" count={stats.parishes} />
        <DashboardCard title="Media Items" count={stats.media} />
        <DashboardCard title="Users" count={stats.users} />
      </div>
    </AdminLayout>
  );
}

function DashboardCard({ title, count }) {
  return (
    <div className="bg-soft p-4 rounded-lg shadow hover:shadow-md transition">
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
      <p className="text-3xl text-primary font-bold">{count}</p>
    </div>
  );
}
