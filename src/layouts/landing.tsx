import { useEffect } from "react";
import { Outlet } from "react-router";
import CursorTrail from "@/common/components/cursor";

export default function LandingLayout() {
  useEffect(() => {
    document.body.style.backgroundColor = "#272727";
    document.body.style.color = "#FFFFFF";
    document.body.style.fontFamily = "Roboto Mono, sans-serif";
  }, []);

  return (
    <div className="relative flex h-screen flex-col">
      <CursorTrail />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
