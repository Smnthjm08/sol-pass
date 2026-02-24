"use client";

import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventForm() {
    const router = useRouter();
    const { publicKey, connected } = useWallet();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [isFree, setIsFree] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const handleSubmit = async () => {
        setError(null);

        if (!connected || !publicKey) {
            setError("Please connect your wallet first.");
            return;
        }
        if (!name.trim() || !description.trim() || !date) {
            setError("Name, description, and date are required.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post("/api/events", {
                publicKey: publicKey.toBase58(),
                name: name.trim(),
                description: description.trim(),
                date,
                location: location.trim() || undefined,
                capacity: capacity || undefined,
                price: !isFree ? price || undefined : undefined,
                isFree,
                isOnline,
                isOffline,
            });

            router.push(`/event/${data.id}`);
        } catch (err) {
            const axiosErr = err as AxiosError<{ error: string }>;
            setError(axiosErr.response?.data?.error ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FieldSet className="w-full max-w-2xl mx-auto">
            <FieldLegend className="text-3xl font-bold">Create Event</FieldLegend>
            <FieldDescription>Fill in the details for your event</FieldDescription>

            <FieldGroup>
                {/* Name */}
                <Field>
                    <FieldLabel htmlFor="name">Event Name *</FieldLabel>
                    <Input
                        id="name"
                        placeholder="Web3 Builders Meetup"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Field>

                {/* Description */}
                <Field>
                    <FieldLabel htmlFor="description">Description *</FieldLabel>
                    <Textarea
                        id="description"
                        placeholder="Tell attendees what to expect..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>

                {/* Date */}
                <Field>
                    <FieldLabel htmlFor="date">Date & Time *</FieldLabel>
                    <Input
                        id="date"
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                        id="location"
                        placeholder="Mumbai, India or https://meet.google.com/..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <FieldDescription>Physical address or virtual link</FieldDescription>
                </Field>


                <Field>
                    <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                    <Input
                        id="capacity"
                        type="number"
                        min={1}
                        placeholder="e.g. 100"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />
                    <FieldDescription>Leave blank for unlimited</FieldDescription>
                </Field>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="isFree" className="font-medium">Free Event</Label>
                            <p className="text-xs text-muted-foreground">No ticket price</p>
                        </div>
                        <Switch
                            id="isFree"
                            checked={isFree}
                            onCheckedChange={(v) => {
                                setIsFree(v);
                                if (v) setPrice("");
                            }}
                        />
                    </div>

                    {!isFree && (
                        <Field>
                            <FieldLabel htmlFor="price">Price (SOL)</FieldLabel>
                            <Input
                                id="price"
                                type="number"
                                min={0}
                                step={0.001}
                                placeholder="e.g. 0.5"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Field>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="isOnline" className="font-medium">Online</Label>
                            <p className="text-xs text-muted-foreground">Virtual event</p>
                        </div>
                        <Switch id="isOnline" checked={isOnline} onCheckedChange={setIsOnline} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="isOffline" className="font-medium">In-Person</Label>
                            <p className="text-xs text-muted-foreground">Physical venue</p>
                        </div>
                        <Switch id="isOffline" checked={isOffline} onCheckedChange={setIsOffline} />
                    </div>
                </div>
            </FieldGroup>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            {!connected && (
                <p className="text-sm text-amber-500 mt-2">⚠️ Connect your wallet to create an event.</p>
            )}

            <Button
                onClick={handleSubmit}
                disabled={loading || !connected || !name.trim() || !description.trim() || !date}
                className="w-full mt-4"
            >
                {loading ? "Creating..." : "Create Event"}
            </Button>
        </FieldSet>
    );
}
