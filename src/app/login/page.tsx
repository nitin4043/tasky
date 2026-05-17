"use client";

import { useState, useSearchParams } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error || "Failed to sign in. Please check your credentials.");
                setLoading(false);
            } else if (result?.ok) {
                // Force a refresh to ensure session is loaded before redirecting
                await new Promise(resolve => setTimeout(resolve, 500));
                router.push(callbackUrl);
            } else {
                setError("An unexpected error occurred. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Sign in error:", err);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 px-4 py-12">
            <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">TaskFlow</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to continue managing your projects and tasks.
                    </p>
                    <div className="mt-8 space-y-4 text-sm text-slate-600">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">Tip</p>
                            <p className="mt-1 text-xs">Use the demo admin credentials from your seed data.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">Need access?</p>
                            <p className="mt-1 text-xs">Invite your team to a project workspace in minutes.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                    <h2 className="text-xl font-semibold text-slate-900">Login</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Use your email and password to access the dashboard.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-300 focus:outline-none"
                                placeholder="name@company.com"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-slate-700">
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-300 focus:outline-none"
                                placeholder="Your password"
                                required
                            />
                        </label>

                        {error ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                        <div className="text-center text-xs text-slate-500">
                            New here?{" "}
                            <a className="font-semibold text-slate-900" href="/signup">
                                Create an account
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
