import { Link, Outlet } from "react-router-dom";

export default function DeveloperLayout() {
  return (
    <div>
      <header className="bg-green-600 text-white p-4">
        Developer Dashboard
      </header>
      <header className="bg-green-600 text-white p-4 flex gap-4">
        <Link to="/developer">Unassigned Bugs</Link>
        <Link to="/developer/assigned">My Bugs</Link>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
