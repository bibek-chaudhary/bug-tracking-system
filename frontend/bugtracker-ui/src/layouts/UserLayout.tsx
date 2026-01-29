import { Outlet } from "react-router-dom";

const UserLayout=() => {
    return(<div>
      <header className="bg-blue-600 text-white p-4">
        User Dashboard
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>)
}

export default UserLayout;