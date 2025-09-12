import { Navbar } from "@/components/navbar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">{children}</main>
      <footer className="flex w-full items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current"
          href="https://github.com/voenkomatiwe"
          title="voenkomatiwe homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">voenkomatiwe</p>
        </a>
      </footer>
    </div>
  );
}
