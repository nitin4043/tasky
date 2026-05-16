import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function AppShell({ title, subtitle, children }: AppShellProps) {
    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
            <TopBar />
            <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 pt-6 md:grid-cols-[240px_1fr]">
                <Sidebar />
                <main className="space-y-8 min-w-0">
                    <header className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm sm:p-6">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
                        {subtitle ? (
                            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                        ) : null}
                    </header>
                    {children}
                </main>
            </div>
        </div>
    );
}
