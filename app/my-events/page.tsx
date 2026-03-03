"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { CalendarDays, MapPin, Users, Plus, Loader2, Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string | null;
    isFree: boolean;
    price: string | null;
    isOnline: boolean;
    isOffline: boolean;
    _count: { tickets: number };
    capacity: number | null;
}

export default function MyEventsPage() {
    const { publicKey, connected } = useWallet();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!connected || !publicKey) return;
        
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/user/${publicKey.toBase58()}`);
                setEvents(res.data.events || []);
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, [connected, publicKey]);

    if (!connected) {
        return (
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
                    <h1 className="text-xl font-semibold mb-2">Connect your wallet</h1>
                    <p className="text-muted-foreground text-sm">
                        Connect your wallet to view your events
                    </p>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">My Events</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage events you&apos;ve created
                    </p>
                </div>
                <Link href="/event/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                    <CalendarDays className="w-10 h-10 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No events created</p>
                    <p className="text-sm mt-1 mb-4">
                        Start by creating your first event
                    </p>
                    <Link href="/event/create">
                        <Button variant="outline">Create Event</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map((event) => {
                        const formattedDate = new Intl.DateTimeFormat("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        }).format(new Date(event.date));

                        const isPast = new Date(event.date) < new Date();

                        return (
                            <Card key={event.id} className="flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-wrap gap-1.5">
                                            {isPast && (
                                                <Badge variant="secondary">Past</Badge>
                                            )}
                                            {event.isFree && (
                                                <Badge variant="outline">Free</Badge>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/event/${event.id}/edit`} className="flex items-center gap-2">
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive flex items-center gap-2" disabled>
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-3">
                                    <Link href={`/event/${event.id}`}>
                                        <h2 className="font-semibold text-base hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2">
                                            {event.name}
                                        </h2>
                                    </Link>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="space-y-1.5 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                                            <span>{formattedDate}</span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 shrink-0" />
                                            <span>
                                                {event._count.tickets}
                                                {event.capacity && ` / ${event.capacity}`} attendees
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-3 border-t">
                                    <Link href={`/event/${event.id}`} className="w-full">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View Event
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
