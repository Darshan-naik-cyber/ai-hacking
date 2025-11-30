"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    ShieldAlert,
    Terminal,
    Database,
    ServerCrash,
    Link as LinkIcon,
    UserX,
    Puzzle,
    Bot,
    SearchCheck,
    Copy,
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";

const vulnerabilities = [
    {
        name: "Prompt Injection",
        href: "/prompt-injection",
        icon: Terminal,
    },
    {
        name: "Insecure Output Handling",
        href: "/insecure-output-handling",
        icon: ShieldAlert,
    },
    {
        name: "Training Data Poisoning",
        href: "/training-data-poisoning",
        icon: Database,
    },
    {
        name: "Model Denial of Service",
        href: "/model-dos",
        icon: ServerCrash,
    },
    {
        name: "Supply Chain Vulnerabilities",
        href: "/supply-chain",
        icon: LinkIcon,
    },
    {
        name: "Sensitive Information Disclosure",
        href: "/sensitive-info",
        icon: UserX,
    },
    {
        name: "Insecure Plugin Design",
        href: "/insecure-plugin",
        icon: Puzzle,
    },
    {
        name: "Excessive Agency",
        href: "/excessive-agency",
        icon: Bot,
    },
    {
        name: "Overreliance",
        href: "/overreliance",
        icon: SearchCheck,
    },
    {
        name: "Model Theft",
        href: "/model-theft",
        icon: Copy,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg lg:hidden hover:bg-zinc-800 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-zinc-100" />
                ) : (
                    <Menu className="h-6 w-6 text-zinc-100" />
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50 transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl text-emerald-500"
                        onClick={closeSidebar}
                    >
                        <ShieldAlert className="h-6 w-6" />
                        <span>LLM Sec 2025</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        <li>
                            <Link
                                href="/"
                                onClick={closeSidebar}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    pathname === "/"
                                        ? "bg-zinc-800 text-emerald-400"
                                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
                                )}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </li>
                        <li className="my-2 border-t border-zinc-800" />
                        <li className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Vulnerabilities
                        </li>
                        {vulnerabilities.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "bg-zinc-800 text-emerald-400"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="border-t border-zinc-800 p-4">
                    <div className="text-xs text-zinc-500">
                        OWASP Top 10 for LLM Applications 2025
                    </div>
                </div>
            </div>
        </>
    );
}
