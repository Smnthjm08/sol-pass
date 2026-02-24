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
        if (!publicKey) return;

        const { data, status } = await axios.post("/api/auth", {
            publicKey: publicKey.toBase58(),
        });

        if (status === 200 && !data.username) {
            router.push("/onboarding");
        }
    }

    useEffect(() => {
        if (connected) {
            handleConnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected, publicKey]);

    return (
        <div>
            {mounted ? <WalletMultiButton /> : <Skeleton className="w-40 h-10" />}
        </div>
    );
}