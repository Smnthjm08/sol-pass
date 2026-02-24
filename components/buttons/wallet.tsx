"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Wallet() {
    const { publicKey, connected } = useWallet();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleConnect() {
        console.log("Connected");
        console.log(publicKey?.toBase58());
        const data = await axios.post("/api/auth", {
            publicKey: publicKey?.toBase58()
        });
        console.log(data);
        if (data.status === 200) {
            console.log("User created");
            if (!data.data?.username) {
                // router.push("/onboarding");
            }
            console.log("User already exists");
        }
    }

    useEffect(() => {
        if (connected) {
            handleConnect();
        }
    }, [connected, publicKey])

    return (
        <main>
            {mounted ? <WalletMultiButton /> : <Skeleton className="w-40 h-10" />}
        </main>
    )
}