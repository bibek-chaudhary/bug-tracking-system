import { Link, Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <header className="bg-blue-600 text-white p-4">User Dashboard</header>
      <header className="bg-blue-600 text-white p-4 flex gap-4">
        <Link to="/user">My Bugs</Link>
        <Link to="/user/report">Report Bug</Link>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
