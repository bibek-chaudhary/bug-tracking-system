import { Outlet } from "react-router-dom";

export default function DeveloperLayout() {
  return (
    <div>
      <header className="bg-green-600 text-white p-4">
        Developer Dashboard
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
