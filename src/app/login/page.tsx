import { login } from "./login-actions";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Smart Bookmark App
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage your bookmarks
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <button
                        formAction={login}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
}
