"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios, { AxiosError } from "axios";
import { CalendarDays, MapPin, Users, Globe, UserCircle, Mail, Wallet, Loader2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Creator {
    username: string | null;
    publicKey: string;
}

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
    creator: Creator;
    _count: { tickets: number };
    capacity: number | null;
}

interface Ticket {
    id: string;
    event: Event;
    createdAt: string;
}

interface UserProfile {
    id: string;
    publicKey: string;
    username: string | null;
    email: string | null;
    bio: string | null;
    events: Event[];
    tickets: Ticket[];
}

export default function MyProfilePage() {
    const { publicKey, connected } = useWallet();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [activeTab, setActiveTab] = useState<"tickets" | "hosting">("tickets");

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editBio, setEditBio] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchUser = async () => {
        if (!publicKey) return;
        try {
            setLoading(true);
            const res = await axios.get(`/api/user/${publicKey.toBase58()}`);
            setUser(res.data);
            setEditUsername(res.data.username || "");
            setEditEmail(res.data.email || "");
            setEditBio(res.data.bio || "");
            setNeedsOnboarding(false);
        } catch (err) {
            const axiosErr = err as AxiosError;
            if (axiosErr.response?.status === 404) {
                setNeedsOnboarding(true);
            } else {
                console.error("Error fetching user:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (connected && publicKey) {
            fetchUser();
        } else if (!connected) {
            setLoading(false);
            setNeedsOnboarding(false);
        }
    }, [connected, publicKey]);

    const handleUpdateProfile = async () => {
        setUpdateError(null);
        if (!publicKey) return;

        if (!editUsername.trim()) {
            setUpdateError("Username is required.");
            return;
        }

        try {
            setUpdateLoading(true);
            const res = await axios.put(`/api/user/${publicKey.toBase58()}`, {
                username: editUsername.trim(),
                email: editEmail.trim() || undefined,
                bio: editBio.trim() || undefined,
            });
            setUser({ ...user!, ...res.data });
            setIsEditDialogOpen(false);
        } catch (err) {
            const axiosErr = err as AxiosError<{ error: string }>;
            setUpdateError(axiosErr.response?.data?.error ?? "Something went wrong.");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (!connected) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-20 text-center">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
                <p className="text-muted-foreground mb-6">Please connect your Solana wallet to view your profile and tickets.</p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b pb-8">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 text-center md:text-left">
                        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                        <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                        <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </main>
        );
    }

    if (needsOnboarding) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <UserCircle className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        You haven&apos;t setup a username or profile yet. Complete onboarding to view your dashboard.
                    </p>
                </div>
                <Link href="/onboarding">
                    <Button className="rounded-full px-8">Get Started</Button>
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* User Info */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-secondary pb-10 mb-10">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 border-2 border-violet-500/20 shadow-xl overflow-hidden">
                        <UserCircle className="w-20 h-20" />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {user?.username || "Unnamed Voyager"}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-mono bg-secondary/50 px-2 py-0.5 rounded border border-secondary">
                                <Wallet className="w-3.5 h-3.5 text-violet-500" />
                                {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                            </span>
                            {user?.email && (
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-violet-500" />
                                    {user.email}
                                </span>
                            )}
                        </div>
                    </div>
                    {user?.bio && (
                        <p className="text-muted-foreground max-w-xl leading-relaxed italic">
                            &quot;{user.bio}&quot;
                        </p>
                    )}
                    <div className="pt-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-full px-4 gap-2">
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Update your profile information visible to other users.
                                    </DialogDescription>
                                </DialogHeader>
                                <FieldGroup className="py-4">
                                    <Field>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            id="username"
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            placeholder="Evil Rabbit"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            placeholder="rabbit@solana.com"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                        <Textarea
                                            id="bio"
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                        />
                                    </Field>
                                </FieldGroup>
                                {updateError && (
                                    <p className="text-sm text-destructive mt-2">{updateError}</p>
                                )}
                                <DialogFooter>
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={updateLoading || !editUsername.trim()}
                                        className="w-full sm:w-auto"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-8">
                <div className="flex p-1 bg-secondary/30 rounded-lg w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab("tickets")}
                        className={cn(
                            "px-6 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === "tickets"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        My Tickets ({user?.tickets.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab("hosting")}
                        className={cn(
                            "px-6 py-2 rounded-md text-sm font-medium transition-all",
                            activeTab === "hosting"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        Hosted Events ({user?.events.length || 0})
                    </button>
                </div>

                {activeTab === "tickets" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {user?.tickets.length === 0 ? (
                            <div className="col-span-full py-20 text-center space-y-3 rounded-2xl border-2 border-dashed border-secondary">
                                <p className="text-muted-foreground">You haven&apos;t joined any events yet.</p>
                                <Link href="/explore">
                                    <Button variant="secondary">Go to Explore</Button>
                                </Link>
                            </div>
                        ) : (
                            user?.tickets.map(ticket => (
                                <EventTicketCard key={ticket.id} event={ticket.event} />
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {user?.events.length === 0 ? (
                            <div className="col-span-full py-20 text-center space-y-3 rounded-2xl border-2 border-dashed border-secondary">
                                <p className="text-muted-foreground">You haven&apos;t hosted any events yet.</p>
                                <Link href="/event/create">
                                    <Button variant="secondary">Create Event</Button>
                                </Link>
                            </div>
                        ) : (
                            user?.events.map(event => (
                                <EventHostCard key={event.id} event={event} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

function EventTicketCard({ event }: { event: Event }) {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(event.date));

    return (
        <Link href={`/event/${event.id}`}>
            <Card className="hover:border-violet-500/40 transition-all hover:shadow-lg group overflow-hidden">
                <CardHeader className="pb-3 px-5 pt-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-lg group-hover:text-violet-500 transition-colors line-clamp-1">{event.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 text-xs">
                                <span className="font-medium text-foreground">by {event.creator.username || event.creator.publicKey.slice(0, 6)}</span>
                            </CardDescription>
                        </div>
                        {event.isFree ? (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Free</Badge>
                        ) : (
                            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">{event.price} SOL</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {event.isOnline ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                            <span className="truncate">{event.location}</span>
                        </div>
                    )}
                </CardContent>
                <div className="h-1 bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Card>
        </Link>
    );
}

function EventHostCard({ event }: { event: Event }) {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(event.date));

    return (
        <Link href={`/event/${event.id}`}>
            <Card className="hover:border-violet-500/40 transition-all hover:shadow-lg group">
                <CardHeader className="pb-3 px-5 pt-5">
                    <CardTitle className="text-lg group-hover:text-violet-500 transition-colors line-clamp-1">{event.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event._count.tickets} Joined
                        </span>
                        {event.capacity && (
                            <span className="text-muted-foreground">
                                Cap: {event.capacity}
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                </CardContent>
                <CardFooter className="px-5 pb-4 pt-0">
                    <Button variant="secondary" size="sm" className="w-full text-xs h-8">Manage Event</Button>
                </CardFooter>
            </Card>
        </Link>
    );
}