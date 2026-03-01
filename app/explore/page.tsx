import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Globe, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ExplorePage() {
    const events = await prisma.event.findMany({
        orderBy: { date: "asc" },
        include: {
            creator: { select: { username: true, publicKey: true } },
            _count: { select: { tickets: true } },
        },
    });

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Explore Events</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Discover events and collect your ticket as an NFT
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No events yet.</p>
                    <p className="text-sm mt-1">Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map((event) => {
                        const formattedDate = new Intl.DateTimeFormat("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        }).format(new Date(event.date));

                        const creatorName =
                            event.creator.username ??
                            event.creator.publicKey.slice(0, 6) + "...";

                        return (
                            <Link key={event.id} href={`/event/${event.id}`}>
                                <div className="group rounded-2xl border bg-card hover:border-violet-400 transition-all hover:shadow-md p-5 space-y-4 h-full flex flex-col">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {event.isFree && (
                                            <Badge variant="secondary">Free</Badge>
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
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                                            {event.name}
                                        </h2>
                                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Meta */}
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
                                        {event.capacity && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 shrink-0" />
                                                <span>
                                                    {event._count.tickets} / {event.capacity} attending
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                        <span>by {creatorName}</span>
                                        <span className="font-medium text-foreground">
                                            {event.isFree ? "Free" : `${event.price ?? "—"} SOL`}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </main>
    );
}