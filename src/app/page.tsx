import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-indigo-600 rounded-md"></div>
          <span className="text-xl font-bold text-gray-900">SmartBookmarks</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4 text-gray-900">
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Save your web, <span className="text-indigo-600">instantly.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Allow your links to travel with you. Secure, fast, and simple bookmark management for the modern web.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700 disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 text-gray-900"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <svg
                    className=" text-indigo-600 h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Private & Secure</h2>
                <p className="text-gray-500 text-center">
                  Your bookmarks are yours alone. Protected by Row Level Security.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <svg
                    className=" text-indigo-600 h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m16 16-4-4-4 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Real-time Sync</h2>
                <p className="text-gray-500 text-center">
                  Add a bookmark on one tab, watch it appear instantly on another.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <svg
                    className=" text-indigo-600 h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c-2-2.33-3-5.5-3-8h6c0 2.5-1 5.67-3 8" />
                    <path d="M12 12v9" />
                    <path d="M12 21a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Simple UI</h2>
                <p className="text-gray-500 text-center">
                  No clutter. Just your links, exactly where you need them.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 SmartBookmarks. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
