import { useEffect } from "react";
import { Outlet } from "react-router";
import { Header } from "@/components/header";

export default function DashboardLayout() {
  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#262626";
    document.body.style.fontFamily = "Product Sans, sans-serif";
  }, []);

  return (
    <div className="relative flex h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl flex-grow px-6">
        <Outlet />
      </main>
    </div>
  );
}
