import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#ededed]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="font-mono text-[14px] font-semibold text-[#f5a623]">404 ERROR</span>
        <h1 className="type-h1 mt-4 text-white">Page Not Found</h1>
        <p className="type-body mt-4 max-w-md text-[#a0a0a0]">
          The trace or page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[#ededed] px-5 py-2.5 text-[14px] font-medium text-black hover:bg-white transition-all shadow-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-[#282828] bg-[#181818] px-5 py-2.5 text-[14px] font-medium text-[#ededed] hover:bg-[#222222] transition-all"
          >
            View Docs
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
