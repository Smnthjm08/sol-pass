"use client"

import { ThemeToggle } from "./theme-toggle";
import Logo from "./logo";
import Wallet from "./buttons/wallet";

export default function AppBar() {
    return (
        <header className="sticky top-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-secondary">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <Logo />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Wallet />
                </div>
            </div>
        </header>
    );
}