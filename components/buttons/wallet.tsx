"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { useRouter } from "next/navigation";
import bs58 from "bs58";

export default function Wallet() {
    const { publicKey, connected, signMessage } = useWallet();
    const [mounted, setMounted] = useState(false);
    const isSigning = useRef(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleConnect() {
        if (!publicKey || !signMessage || isSigning.current) return;

        try {
            isSigning.current = true;
            const message = "Sign this message to authenticate with Fluffy Winner";
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signature);

            const { data, status } = await axios.post("/api/auth", {
                publicKey: publicKey.toBase58(),
                signature: signatureBase58,
                message: message
            });

            if (status === 200 && !data.username) {
                router.push("/onboarding");
            }
        } catch (error) {
            console.error("Authentication failed:", error);
        } finally {
            isSigning.current = false;
        }
    }

    useEffect(() => {
        if (connected && publicKey) {
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