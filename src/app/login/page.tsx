import { login } from "./login-actions";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full bg-white">
            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 flex-col justify-between p-12 text-white">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-white/20 rounded-md backdrop-blur-sm"></div>
                    <span className="text-2xl font-bold">SmartBookmarks</span>
                </div>
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold leading-tight">
                        Organize your digital life with elegance and simplicity.
                    </h1>
                    <p className="text-lg text-indigo-100">
                        Join thousands of users who trust us with their most important links.
                    </p>
                </div>
                <div className="text-sm text-indigo-200">
                    © 2024 SmartBookmarks Inc.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <form action={login}>
                            <button
                                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all hover:shadow-lg"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                Sign in with Google
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
