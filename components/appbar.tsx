"use client"

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import Image from "next/image";

export default function AppBar() {
    return (
        <nav className="flex justify-between h-14 border-2 border-black px-12 items-center">
            <div className="rounded-full bg-black flex items-center gap-2">
                <Image src="./vercel.svg" alt="Logo" width={20} height={20} />
                Logo
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button className="cursor-pointer">Connect Wallet</Button>
            </div>
        </nav>
    );
}