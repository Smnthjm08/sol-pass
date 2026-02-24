"use client"

import { ThemeToggle } from "./utils/theme-toggle";
import Logo from "./utils/logo";
import Wallet from "./buttons/wallet";
import { UserCircle, PlusSquare, Compass } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/event/create", label: "Create Event", icon: PlusSquare },
];

export default function AppBar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-secondary">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <Logo />
                    <nav className="hidden sm:flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link key={href} href={href}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium cursor-pointer",
                                        pathname === href
                                            ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link href="/profile">
                        <Button variant="secondary" size="icon" className="rounded-full cursor-pointer">
                            <UserCircle width={16} height={16} />
                        </Button>
                    </Link>
                    <Wallet />
                </div>
            </div>
        </header>
    );
}