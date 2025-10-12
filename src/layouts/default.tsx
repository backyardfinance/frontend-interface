import { Outlet } from "react-router";
import { Header } from "@/components/header";

export default function DefaultLayout() {
  return (
    <div className="relative flex h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
