"use client";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

export default function OnboardingForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { publicKey } = useWallet();

    const handleOnboard = async () => {
        setError(null);

        // const publicKey = localStorage.getItem("publicKey");
        if (!publicKey) {
            setError("Could not identify your wallet. Please reconnect.");
            return;
        }

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        try {
            setLoading(true);
            await axios.put(`/api/user/${publicKey}`, {
                username: username.trim(),
                email: email.trim() || undefined,
                bio: bio.trim() || undefined,
            });

            router.push("/explore");
        } catch (err) {
            const axiosErr = err as AxiosError<{ error: string }>;
            setError(
                axiosErr.response?.data?.error ?? "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <FieldSet className="sm:min-w-md mx-auto">
            <FieldLegend className="text-center text-3xl font-bold">Onboarding</FieldLegend>
            <FieldDescription className="text-center">
                Complete your profile to get started
            </FieldDescription>

            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="username">Username *</FieldLabel>
                    <Input
                        id="username"
                        autoComplete="username"
                        required
                        placeholder="Evil Rabbit"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FieldDescription>Choose a unique username</FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="evil.rabbit@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FieldDescription>Optional — for notifications</FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <Input
                        id="bio"
                        autoComplete="off"
                        placeholder="Tell us a bit about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <FieldDescription>Optional — shown on your profile</FieldDescription>
                </Field>
            </FieldGroup>

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}

            <Button
                onClick={handleOnboard}
                disabled={loading || !username.trim()}
                className="w-full mt-2"
            >
                {loading ? "Saving..." : "Complete Onboarding"}
            </Button>
        </FieldSet>
    );
}