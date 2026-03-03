"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import axios from "axios";
import {
    CalendarDays,
    MapPin,
    Users,
    Ticket,
    Globe,
    Building2,
    ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ShareEventDialog } from "@/components/events/share-event-dialog";

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string | null;
    capacity: number | null;
    price: string | null;
    isFree: boolean;
    isOnline: boolean;
    isOffline: boolean;
    creator: { id: string; username: string | null; publicKey: string };
    _count: { tickets: number };
}

export default function EventPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();

    useEffect(() => {
        axios
            .get(`/api/events/${id}`)
            .then((res) => setEvent(res.data))
            .catch((err) => {
                console.error(err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <EventSkeleton />;
    if (error || !event) return notFound();

    const creatorName =
        event.creator.username ?? event.creator.publicKey.slice(0, 8) + "...";

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(event.date));

    const formattedTime = new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(event.date));

    const isSoldOut =
        event.capacity !== null && event._count.tickets >= event.capacity;

    const spotsLeft = event.capacity
        ? event.capacity - event._count.tickets
        : null;

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-wrap gap-2">
                        {event.isFree && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-0">
                                Free
                            </Badge>
                        )}
                        {event.isOnline && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Online
                            </Badge>
                        )}
                        {event.isOffline && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> In-Person
                            </Badge>
                        )}
                        {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                            {event.name}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Hosted by{" "}
                            <span className="font-medium text-foreground">{creatorName}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <MetaCard icon={CalendarDays} label="Date & Time">
                            <p className="text-sm font-semibold">{formattedDate}</p>
                            <p className="text-sm text-muted-foreground">{formattedTime}</p>
                        </MetaCard>

                        {event.location && (
                            <MetaCard icon={MapPin} label="Location">
                                <p className="text-sm font-semibold break-all">{event.location}</p>
                            </MetaCard>
                        )}

                        <MetaCard icon={Ticket} label="Price">
                            <p className="text-sm font-semibold">
                                {event.isFree ? "Free" : `${event.price ?? "—"} SOL`}
                            </p>
                        </MetaCard>

                        {event.capacity && (
                            <MetaCard icon={Users} label="Attendees">
                                <p className="text-sm font-semibold">
                                    {event._count.tickets} / {event.capacity}
                                </p>
                                {spotsLeft !== null && !isSoldOut && (
                                    <p className="text-xs text-amber-500">
                                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                                    </p>
                                )}
                            </MetaCard>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">About this event</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>
                </div>

                {/* Right — sticky CTA */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-5 shadow-sm">
                        <div>
                            <p className="text-2xl font-bold">
                                {event.isFree ? "Free" : `${event.price ?? "—"} SOL`}
                            </p>
                            {event.capacity && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isSoldOut
                                        ? "No spots remaining"
                                        : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 shrink-0" />
                                <span>{formattedDate}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full cursor-pointer"
                            size="lg"
                            disabled={isSoldOut}
                            onClick={() => {
                                if (!connected) {
                                    setVisible(true);
                                    return;
                                }
                                // TODO: Implementation for getting ticket/minting NFT
                                console.log("Get Ticket clicked");
                            }}
                        >
                            {isSoldOut ? "Sold Out" : "Get Ticket"}
                        </Button>

                        <ShareEventDialog eventName={event.name} />

                        <p className="text-xs text-center text-muted-foreground">
                            Ticket will be minted to your wallet as an NFT
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function MetaCard({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ElementType;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-card">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950">
                <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {label}
                </p>
                <div className="mt-0.5">{children}</div>
            </div>
        </div>
    );
}

function EventSkeleton() {
    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <Skeleton className="h-4 w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-72 rounded-2xl" />
                </div>
            </div>
        </main>
    );
}
