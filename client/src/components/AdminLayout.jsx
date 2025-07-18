// AdminLayout.jsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-soft text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <a href="/admin/dashboard" className="block hover:text-secondary">Dashboard</a>
          <a href="/admin/news" className="block hover:text-secondary">News</a>
          <a href="/admin/videos" className="block hover:text-secondary">Videos</a>
          <a href="/admin/events" className="block hover:text-secondary">Events</a>
          <a href="/admin/Directory" className="block hover:text-secondary">Directory</a>
          <a href="/admin/parishes" className="block hover:text-secondary">Parishes</a>
          <a href="/admin/media" className="block hover:text-secondary">Gallery</a>
          <a href="/admin/users" className="block hover:text-secondary">Users</a>
          <a href="/admin/contact" className="block hover:text-secondary">Contact Message</a>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
